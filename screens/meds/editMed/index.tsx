import React, { useEffect, useState } from "react"
import { router, useLocalSearchParams } from "expo-router"
import { SafeAreaView } from "@/components/ui/safe-area-view"
import { ScrollView } from "@/components/ui/scroll-view"
import { VStack } from "@/components/ui/vstack"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { useForm, Controller } from "react-hook-form"
import { useToast, Toast, ToastTitle } from "@/components/ui/toast"
import { Pressable } from "@/components/ui/pressable"
import { FormField } from "./components/FormField"
import { SelectField } from "./components/SelectField"
import { TextareaField } from "./components/TextareaField"
import { ArrowLeftIcon, ChevronDownIcon, ChevronUpIcon, Icon } from "@/components/ui/icon"
import { TimePickerField } from "./components/TimePickerField"
import { medFormOptions, dosageOptions, frequencyOptions } from '@/constants/options'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import MedLayout from "../layout"
import { supabase } from "@/lib/supabase"

const EditMedSchema = z.object({
  med_name: z.string().min(1, "Nama Obat belum diisi"),
  med_form: z.string().min(1, "Bentuk Obat belum diisi"),
  dosage: z.string().min(1, "Dosis belum diisi"),
  dose_quantity: z.number().positive(),
  frequency: z.string().min(1, "Frekuensi belum diisi"),
  frequency_times_per_day: z.number().min(1),
  frequency_interval_days: z.number().min(1),
  reminder_times: z.array(z.string().min(1, "Pengingat belum dipilih")),
  stock_quantity: z.number().positive("Stok Obat harus lebih dari 0").min(1, "Stok Obat belum diisi"),
  duration: z.number().positive("Durasi harus lebih dari 0").min(1, "Durasi belum diisi"),
  instructions: z.string().nullable().optional().transform(val => val ?? ""),
  prescribing_doctor: z.string().nullable().optional().transform(val => val ?? ""),
  dispensing_pharmacy: z.string().nullable().optional().transform(val => val ?? ""),
  med_photos: z.string().nullable().optional().transform(val => val ?? "")
})

type EditMedSchemaType = z.infer<typeof EditMedSchema>

const EditMedScreen = () => {
  const { med: medString } = useLocalSearchParams()
  const med = medString ? JSON.parse(medString as string) : null

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    getValues,
    watch,
  } = useForm<EditMedSchemaType>({
    resolver: zodResolver(EditMedSchema),
    defaultValues: {
      ...med,
      reminder_times: med?.reminder_times || [],
    },
  })

  const [isDetailVisible, setDetailVisible] = useState(false)
  const [timesPerDay, setTimesPerDay] = useState(med?.frequency_times_per_day || 0)
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
        setValue("reminder_times", med?.reminder_times || Array(selectedOption.times_per_day).fill(""))
        setValue("frequency_times_per_day", selectedOption.times_per_day)
        setValue("frequency_interval_days", selectedOption.interval_days)
      }
    }
  }, [selectedFrequency, med?.reminder_times, setValue])

  // Handle time change for each TimePicker
  const handleTimeChange = (index: number, time: string) => {
    const currentTimes = getValues("reminder_times")
    currentTimes[index] = time
    setValue("reminder_times", currentTimes)
  }

  const onSubmit = async (data: EditMedSchemaType) => {
    let uploadedImagePath = med?.med_photos
    const selectedImageUri = getValues("med_photos")

    // Upload new image if needed
    if (selectedImageUri && selectedImageUri !== med?.med_photos) {
      try {
        const response = await fetch(selectedImageUri)
        const arrayBuffer = await response.arrayBuffer()
        const fileExt = selectedImageUri.split(".").pop()
        const fileName = `${Date.now()}.${fileExt}`

        const { data: storageData, error: uploadError } = await supabase.storage
          .from("med_photos")
          .upload(fileName, arrayBuffer, {
            contentType: `image/${fileExt}`,
          })

        if (uploadError) {
          throw uploadError
        }

        uploadedImagePath = storageData.path
      } catch (error) {
        console.error("Error uploading image:", error)
      }
    }

    const formattedData = {
      ...data,
      reminder_times: data.reminder_times, // Use the existing reminder times as strings
      med_photos: uploadedImagePath || null,
    }

    try {
      const { error } = await supabase
        .from("medicines")
        .update(formattedData)
        .eq("id", med.id)

      if (error) {
        throw error
      }

      toast.show({
        placement: "top left",
        render: ({ id }: { id: string }) => (
          <Toast nativeID={id} variant="solid" action="success">
            <ToastTitle className="text-white">Obat berhasil diperbarui!</ToastTitle>
          </Toast>
        ),
      })
      router.push("/medication")
      reset()
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error updating medicine:", error.message)
        toast.show({
          placement: "top left",
          render: ({ id }: { id: string }) => (
            <Toast nativeID={id} variant="solid" action="error">
              <ToastTitle className="text-white">Gagal memperbarui obat!</ToastTitle>
            </Toast>
          ),
        })
      }
    }
  }

  const onError = (errors: any) => {
    console.log("Form validation errors:", errors)
  }

  return (
    <VStack space="3xl" className="flex-1">
      <HStack space="md" className="items-center">
        <Pressable onPress={() => router.back()}>
          <Icon as={ArrowLeftIcon} className="text-amost-secondary-dark_1" size="2xl" />
        </Pressable>
        <Heading size="2xl" className="text-amost-secondary-dark_1 font-black">
          Edit Obat
        </Heading>
      </HStack>
      <ScrollView>
        <VStack space="md">
          <FormField name="med_name" label="Nama Obat" control={control} error={errors.med_name?.message} placeholder="Masukkan nama obat" />
          <SelectField name="med_form" label="Bentuk Obat" control={control} options={medFormOptions} error={errors.med_form?.message} />
          <SelectField name="dosage" label="Dosis" control={control} options={applicableDosageOptions} setValue={setValue} error={errors.dosage?.message} />
          <SelectField name="frequency" label="Frekuensi" control={control} options={frequencyOptions} setValue={setValue} error={errors.frequency?.message} />

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
                      value={value || ""}
                      onChange={(time: string) => {
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

          {isDetailVisible && <DetailFields control={control} setValue={setValue} />}

          <ToggleDetailsButton isDetailVisible={isDetailVisible} setDetailVisible={setDetailVisible} />
        </VStack>
        <SubmitButton onSubmit={handleSubmit(onSubmit, onError)} />
      </ScrollView>
    </VStack>
  )
}

const DetailFields = ({ control, setValue }: any) => (
  <VStack space="md">
    <TextareaField name="instructions" label="Instruksi" control={control} error={null} placeholder="Masukkan instruksi obat" />
    <FormField name="prescribing_doctor" label="Dokter Yang Meresepkan" control={control} placeholder="Dr. John Doe" />
    <FormField name="dispensing_pharmacy" label="Nama Apotek" control={control} placeholder="Apotek ABC" />
    <FormField name="med_photos" label="Foto Obat" control={control} setValue={setValue} placeholder="Masukkan Foto Obat" isImagePicker={true} />
  </VStack>
)

const ToggleDetailsButton = ({ isDetailVisible, setDetailVisible }: any) => (
  <Button
    className="max-w-36 h-12 rounded-full"
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

const SubmitButton = ({ onSubmit }: any) => (
  <Button
    className="bg-amost-primary rounded-full w-full mt-12"
    size="xl"
    onPress={() => {
      console.log("Submit button clicked")
      onSubmit()
    }}
  >
    <ButtonText className="font-medium text-white">Perbarui</ButtonText>
  </Button>
)

export const EditMed = () => {
  return (
    <MedLayout>
      <EditMedScreen />
    </MedLayout>
  )
}
