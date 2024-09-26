import React, { useEffect, useState } from "react"
import { router } from "expo-router"
import { SafeAreaView } from "@/components/ui/safe-area-view"
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
import { z } from "zod"
import MedLayout from "../layout"

const AddMedSchema = z.object({
  medName: z.string().min(1, "Nama Obat belum diisi"),
  medForm: z.string().min(1, "Bentuk Obat belum diisi"),
  dosage: z.string().min(1, "Dosis belum diisi"),
  doseQuantity: z.number().positive(),
  frequency: z.string().min(1, "Frekuensi belum diisi"),
  frequencyTimesPerDay: z.number().min(1),
  frequencyIntervalDays: z.number().min(1),
  reminderTimes: z.array(z.date().refine((date) => !isNaN(date.getTime()), { message: "Pengingat belum dipilih" })),
  stockQuantity: z.number().positive("Stok Obat harus lebih dari 0").min(1, "Stok Obat belum diisi"),
  duration: z.number().positive("Durasi harus lebih dari 0").min(1, "Durasi belum diisi"),
  instructions: z.string().optional(),
  prescribingDoctor: z.string().optional(),
  dispensingPharmacy: z.string().optional(),
  imageUri: z.string().optional(),
})

type AddMedSchemaType = z.infer<typeof AddMedSchema>

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
    resolver: zodResolver(AddMedSchema),
    defaultValues: {
      reminderTimes: [],
    },
  })

  const [isDetailVisible, setDetailVisible] = useState(false)
  const [timesPerDay, setTimesPerDay] = useState(0)
  const toast = useToast()

  // Watch the frequency field
  const selectedFrequency = watch("frequency")
  
  // Watch the medForm field
  const selectedMedForm = watch("medForm") as keyof typeof dosageOptions
  const applicableDosageOptions = selectedMedForm ? dosageOptions[selectedMedForm] : []

  // Update timesPerDay based on selected frequency
  useEffect(() => {
    if (selectedFrequency) {
      const selectedOption = frequencyOptions.find(option => option.value === selectedFrequency)
      if (selectedOption) {
        setTimesPerDay(selectedOption.timesPerDay)
        setValue("reminderTimes", Array(selectedOption.timesPerDay).fill(new Date()))
        setValue("frequencyTimesPerDay", selectedOption.timesPerDay)
        setValue("frequencyIntervalDays", selectedOption.intervalDays)
      }
    }
  }, [selectedFrequency, setValue])

  // Handle time change for each TimePicker
  const handleTimeChange = (index: number, time: Date) => {
    // const currentTimes = [...watch("reminderTimes")]
    const currentTimes = getValues("reminderTimes")
    currentTimes[index] = time
    setValue("reminderTimes", currentTimes)
  }

  const onSubmit = (data: AddMedSchemaType) => {
    const formattedData = {
        ...data,
        reminderTimes: data.reminderTimes.map((time) => time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })),
    }

    console.log("Submitted Data:", formattedData)  // Log for debugging

    toast.show({
        placement: "bottom right",
        render: ({ id }: { id: string }) => (
        <Toast nativeID={id} variant="solid" action="success">
            <ToastTitle className="text-white">Obat berhasil ditambahkan!</ToastTitle>
        </Toast>
        ),
    })
    router.push("/medication")
    reset()
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
          <FormField name="medName" label="Nama Obat" control={control} error={errors.medName?.message} placeholder="Masukkan nama obat" />
          <SelectField name="medForm" label="Bentuk Obat" control={control} options={medFormOptions} error={errors.medForm?.message} />
          <SelectField name="dosage" label="Dosis" control={control} options={applicableDosageOptions} setValue={setValue} error={errors.dosage?.message} />
          <SelectField name="frequency" label="Frekuensi" control={control} options={frequencyOptions} setValue={setValue} error={errors.frequency?.message} />
          {/* Dynamically render TimePickerFields based on timesPerDay */}
          {timesPerDay > 0 && (
            <VStack space="md">
                {Array.from({ length: timesPerDay }, (_, index) => (
                <Controller
                    key={index}
                    control={control}
                    name={`reminderTimes.${index}`}
                    render={({ field: { onChange, value } }) => (
                    <TimePickerField
                        label={`Waktu Pengingat ${index + 1}`}
                        value={value || new Date()}
                        onChange={(time: Date) => {
                        onChange(time)
                        handleTimeChange(index, time)
                        }}
                        error={errors.reminderTimes?.[index]?.message}
                    />
                    )}
                />
                ))}
            </VStack>
          )}

          <VStack space="sm">
            <FormField name="stockQuantity" label="Kuantitas Stok" control={control} error={errors.stockQuantity?.message} placeholder="0" isNumeric={true} />
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
    <TextareaField name="instructions" label="Instruksi" control={control} error={null}  placeholder="Masukkan instruksi obat" />
    <FormField name="prescribingDoctor" label="Dokter Yang Meresepkan" control={control} placeholder="Dr. John Doe" />
    <FormField name="dispensingPharmacy" label="Nama Apotek" control={control} placeholder="Apotek ABC" />
    <FormField name="imageUri" label="Foto Obat" control={control} setValue={setValue} placeholder="Masukkan Foto Obat" isImagePicker={true}  />
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
    className="bg-amost-primary rounded-full w-full mt-8"
    size="xl"
    onPress={() => {
      console.log("Submit button clicked")
      onSubmit()
    }}
  >
    <ButtonText className="font-medium text-white">Tambah</ButtonText>
  </Button>
)

export const AddMed = () => {
  return (
    <MedLayout>
      <AddMedScreen />
    </MedLayout>
  )
}