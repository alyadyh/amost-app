import React, { useEffect, useState } from "react"
import { router } from "expo-router"
import { ScrollView } from "@/components/ui/scroll-view"
import { VStack } from "@/components/ui/vstack"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { useForm, Controller, useWatch } from "react-hook-form"
import { useToast, Toast, ToastTitle } from "@/components/ui/toast"
import { Pressable } from "@/components/ui/pressable"
import { FormField } from "./components/FormField"
import { SelectField } from "./components/SelectField"
import { TextareaField } from "./components/TextareaField"
import { ArrowLeftIcon, ChevronDownIcon, ChevronUpIcon, Icon } from "@/components/ui/icon"
import { TimePickerField } from "./components/TimePickerField"
import { medFormOptions, dosageOptions, frequencyOptions } from '@/constants/options'
import { zodResolver } from "@hookform/resolvers/zod"
import { uploadImage, getUserSession, insertMedicine } from "@/lib/supabase"
import { addMedSchema } from "@/schemas/medSchemas"
import MedLayout from "../layout"
import { z } from "zod"
import { Spinner } from "@/components/ui/spinner"

type AddMedSchemaType = z.infer<typeof addMedSchema>

const AddMedScreen = () => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    getValues,
    watch,
  } = useForm<AddMedSchemaType>({
    resolver: zodResolver(addMedSchema),
    defaultValues: {
      reminder_times: [],
    },
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isDetailVisible, setDetailVisible] = useState(false)
  const [timesPerDay, setTimesPerDay] = useState(0)
  const toast = useToast()

  // Watch the frequency field
  const selectedFrequency = watch("frequency")

  // Watch the medForm field
  const selectedMedForm = watch("med_form") as keyof typeof dosageOptions
  const applicableDosageOptions = selectedMedForm ? dosageOptions[selectedMedForm] : []

  // Update timesPerDay based on selected frequency
  useEffect(() => {
    if (selectedFrequency) {
      const selectedOption = frequencyOptions.find(option => option.value === selectedFrequency)
      if (selectedOption) {
        setTimesPerDay(selectedOption.times_per_day)
        setValue("reminder_times", Array(selectedOption.times_per_day).fill(new Date()))
        setValue("frequency_times_per_day", selectedOption.times_per_day)
        setValue("frequency_interval_days", selectedOption.interval_days)
      }
    }
  }, [selectedFrequency, setValue])

  // Handle time change for each TimePicker
  const handleTimeChange = (index: number, time: Date) => {
    // const currentTimes = [...watch("reminderTimes")]
    const currentTimes = getValues("reminder_times")
    currentTimes[index] = time
    setValue("reminder_times", currentTimes)
  }

  const onSubmit = async (data: AddMedSchemaType) => {
    setIsLoading(true)

    const selectedImageUri = getValues("med_photos")
    let uploadedImagePath = null
    console.log("Selected Image URI before upload:", selectedImageUri)

    // Upload the image
    if (selectedImageUri) {
      try {
        uploadedImagePath = await uploadImage(selectedImageUri, "med_photos")
        console.log("Uploaded Image Path:", uploadedImagePath)
      } catch (error) {
        console.error("Error uploading image:", error)
        setIsLoading(false)
      }
    }

    const formattedData = {
      ...data,
      reminder_times: data.reminder_times.map((time) => time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })),
      med_photos: uploadedImagePath || null,
      deleted: false
    }

    console.log("Submitted Data:", formattedData)

    try {
      const session = await getUserSession()
      if (!session) throw new Error("User is not logged in")

      console.log("User id:", session.user.id)

      // Insert the medicine data into Supabase
      const insertSuccess = await insertMedicine(formattedData, session.user.id)

      if (insertSuccess) {
        toast.show({
          placement: "top left",
          render: ({ id }) => <Toast nativeID={id} variant="solid" action="success">
            <ToastTitle className="text-white">Obat berhasil ditambahkan!</ToastTitle>
          </Toast>,
        })
      }
      router.push("/medication")
      reset()
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error inserting medicine:", error.message)
        toast.show({
          placement: "top left",
          render: ({ id }: { id: string }) => (
            <Toast nativeID={id} variant="solid" action="error">
              <ToastTitle className="text-white">Gagal menambahkan obat!</ToastTitle>
            </Toast>
          ),
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const onError = (errors: any) => {
    console.log("Form validation errors:", errors)
  }

  return (
    <VStack space="3xl" className="flex-1">
      <HStack space="md" className="items-center">
        <Pressable
          onPress={() => {
            router.back()
          }}
         >
          <Icon as={ArrowLeftIcon} className="text-amost-secondary-dark_1" size="2xl" />
        </Pressable>
        <Heading size="2xl" className="text-amost-secondary-dark_1 font-black">
          Tambahkan Obat
        </Heading>
      </HStack>
      <ScrollView>
        <VStack space="md">
          <FormField name="med_name" label="Nama Obat" control={control} error={errors.med_name?.message} placeholder="Masukkan nama obat" />
          <SelectField name="med_form" label="Bentuk Obat" control={control} options={medFormOptions} error={errors.med_form?.message} />
          <SelectField name="dosage" label="Dosis" control={control} options={applicableDosageOptions} setValue={setValue} error={errors.dosage?.message} />
          <SelectField name="frequency" label="Frekuensi" control={control} options={frequencyOptions} setValue={setValue} error={errors.frequency?.message} />
          {/* Dynamically render TimePickerFields based on timesPerDay */}
          {timesPerDay > 0 && (
            <VStack space="md">
                {Array.from({ length: timesPerDay }, (_, index) => (
                <Controller
                    key={index}
                    control={control}
                    name={`reminder_times.${index}`}
                    render={({ field: { onChange, value } }) => (
                    <TimePickerField
                        label={`Waktu Pengingat ${index + 1}`}
                        value={value || new Date()}
                        onChange={(time: Date) => {
                        onChange(time)
                        handleTimeChange(index, time)
                        }}
                        error={errors.reminder_times?.[index]?.message}
                    />
                    )}
                />
                ))}
            </VStack>
          )}

          <VStack space="sm">
            <FormField name="stock_quantity" label="Kuantitas Stok" control={control} error={errors.stock_quantity?.message} placeholder="0" isNumeric={true} />
            <Text size="xs" className="text-amost-secondary-dark_2">(Jika cair atau bubuk, tulis jumlah dalam mL atau gram.)</Text>
          </VStack>
          <VStack space="sm">
            <FormField name="duration" label="Durasi Konsumsi Obat" control={control} error={errors.duration?.message} placeholder="0" isNumeric={true} />
            <Text size="xs" className="text-amost-secondary-dark_2">(Tulis durasi dalam hitungan hari)</Text>
          </VStack>

          <ToggleDetailsButton isDetailVisible={isDetailVisible} setDetailVisible={setDetailVisible} />
          {isDetailVisible && <DetailFields control={control} setValue={setValue} />}
        </VStack>
        <SubmitButton onSubmit={handleSubmit(onSubmit, onError)} isLoading={isLoading} />
      </ScrollView>
    </VStack>
  )
}

const DetailFields = ({ control, setValue, setSelectedImageUri }: any) => (
  <VStack space="md">
    <TextareaField name="instructions" label="Instruksi" control={control} error={null}  placeholder="Masukkan instruksi obat" />
    <FormField name="prescribing_doctor" label="Dokter Yang Meresepkan" control={control} placeholder="Dr. John Doe" />
    <FormField name="dispensing_pharmacy" label="Nama Apotek" control={control} placeholder="Apotek ABC" />
    <FormField name="med_photos" label="Foto Obat" control={control} setValue={setValue} placeholder="Masukkan Foto Obat" isImagePicker={true}  />
  </VStack>
)

const ToggleDetailsButton = ({ isDetailVisible, setDetailVisible }: any) => (
  <Button
    className="max-w-36 h-12 rounded-lg mt-4"
    action="secondary"
    size="sm"
    onPress={() => setDetailVisible((prev: boolean) => !prev)}
  >
    <HStack space="md" className="items-center">
      <ButtonText className="text-white font-medium">Opsional</ButtonText>
      <ButtonIcon as={!isDetailVisible ? ChevronDownIcon : ChevronUpIcon} className="stroke-white" />
    </HStack>
  </Button>
)

const SubmitButton = ({ onSubmit, isLoading }: any) => (
  <Button
    className="bg-amost-primary rounded-full w-full mt-12"
    size="xl"
    onPress={() => {
      console.log("Submit button clicked")
      onSubmit()
    }}
  >
    {isLoading ? (
      <Spinner size="small" color="white" />
    ) : (
      <ButtonText className="font-medium text-white">Tambah</ButtonText>
    )}
  </Button>
)

export const AddMed = () => {
  return (
    <MedLayout>
      <AddMedScreen />
    </MedLayout>
  )
}
