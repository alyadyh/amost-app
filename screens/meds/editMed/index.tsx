import React, { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { router, useLocalSearchParams } from "expo-router"
import { SafeAreaView } from "@/components/ui/safe-area-view"
import { ScrollView } from "@/components/ui/scroll-view"
import { VStack } from "@/components/ui/vstack"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { useToast, Toast, ToastTitle } from "@/components/ui/toast"
import { Pressable } from "@/components/ui/pressable"
import { FormField } from "./components/FormField"
import { SelectField } from "./components/SelectField"
import { TextareaField } from "./components/TextareaField"
import { TimePickerField } from "./components/TimePickerField"
import { ArrowLeftIcon, ChevronDownIcon, ChevronUpIcon, Icon } from "@/components/ui/icon"
import { medFormOptions, dosageOptions, frequencyOptions } from '@/constants/options'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import MedLayout from "../layout"

const EditMedSchema = z.object({
  medName: z.string().min(1, "Nama Obat belum diisi"),
  medForm: z.string().min(1, "Bentuk Obat belum diisi"),
  dosage: z.string().min(1, "Dosis belum diisi"),
  frequency: z.string().min(1, "Frekuensi belum diisi"),
  frequencyTimesPerDay: z.number().min(1),
  frequencyIntervalDays: z.number().min(1),
  reminderTimes: z.array(z.date().refine((date) => !isNaN(date.getTime()), { message: "Pengingat belum dipilih" })),
  stockQuantity: z.number().positive("Stok Obat harus lebih dari 0").min(1, "Stok Obat belum diisi"),
  instructions: z.string().optional(),
  prescribingDoctor: z.string().optional(),
  dispensingPharmacy: z.string().optional(),
  imageUri: z.string().optional(),
})

type EditMedSchemaType = z.infer<typeof EditMedSchema>

const EditMedScreen = () => {
  const { med: medString } = useLocalSearchParams() // Get med data from route params
  const med = medString ? JSON.parse(medString as string) : null

  const parseTimeString = (timeString: string): Date => {
    const [hours, minutes] = timeString.split(":").map(Number)
    const now = new Date()
    now.setHours(hours, minutes, 0, 0) // Set the hours and minutes to the current date
    return now
  }

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    getValues,
    watch,
  } = useForm<EditMedSchemaType>({
    resolver: zodResolver(EditMedSchema),
    defaultValues: {
      ...med,
      reminderTimes: med ? med.reminderTimes.map(parseTimeString) : [],
    },
  })

  const [timesPerDay, setTimesPerDay] = useState(med?.frequencyTimesPerDay || 0)
  const [isDetailVisible, setDetailVisible] = useState(false)
  const toast = useToast()

  // Watch the frequency field
  const selectedFrequency = watch("frequency")
  
  // Watch the medForm field
  const selectedMedForm = watch("medForm") as keyof typeof dosageOptions
  const applicableDosageOptions = selectedMedForm ? dosageOptions[selectedMedForm] : []

  // Set frequency values based on med?.frequency or selectedFrequency
  useEffect(() => {
    const frequencyToUse = selectedFrequency || med?.frequency

    if (frequencyToUse) {
      const selectedOption = frequencyOptions.find(option => option.value === frequencyToUse)
      if (selectedOption) {
        setTimesPerDay(selectedOption.timesPerDay)
        setValue("reminderTimes", Array(selectedOption.timesPerDay).fill(new Date()))
        setValue("frequencyTimesPerDay", selectedOption.timesPerDay)
        setValue("frequencyIntervalDays", selectedOption.intervalDays)
      }
    }
  }, [selectedFrequency, med?.frequency, setValue])

  const handleTimeChange = (index: number, time: Date) => {
    const currentTimes = [...getValues("reminderTimes")]
    currentTimes[index] = time
    setValue("reminderTimes", currentTimes)
  }

  const onSubmit = (data: EditMedSchemaType) => {
    const formattedData = {
      ...data,
      reminderTimes: data.reminderTimes.map((time) => time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })),
    }

    console.log("Submitted Data:", formattedData)

    toast.show({
      placement: "bottom right",
      render: ({ id }: { id: string }) => (
        <Toast nativeID={id} variant="solid" action="success">
          <ToastTitle className="text-white">Obat berhasil diperbarui!</ToastTitle>
        </Toast>
      ),
    })
    router.push("/medication")
    reset()
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
        <VStack space="lg">
          <FormField name="medName" label="Nama Obat" control={control} error={errors.medName?.message} placeholder="Masukkan nama obat" />
          <SelectField name="medForm" label="Bentuk Obat" control={control} options={medFormOptions} error={errors.medForm?.message} />
          <SelectField name="dosage" label="Dosis" control={control} options={applicableDosageOptions} setValue={setValue} error={errors.dosage?.message} />
          <SelectField name="frequency" label="Frekuensi" control={control} options={frequencyOptions} setValue={setValue} error={errors.frequency?.message} />
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
          {isDetailVisible && <DetailFields control={control} setValue={setValue} />}
          <ToggleDetailsButton isDetailVisible={isDetailVisible} setDetailVisible={setDetailVisible} />
        </VStack>
        <SubmitButton onSubmit={handleSubmit(onSubmit)} />
      </ScrollView>
    </VStack>
  )
}

const DetailFields = ({ control, setValue }: any) => (
  <VStack space="md">
    <TextareaField name="instructions" label="Instruksi" control={control} error={null} placeholder="Masukkan instruksi obat" />
    <FormField name="prescribingDoctor" label="Dokter Yang Meresepkan" control={control} placeholder="Dr. John Doe" />
    <FormField name="dispensingPharmacy" label="Nama Apotek" control={control} placeholder="Apotek ABC" />
    <FormField name="imageUri" label="Foto Obat" control={control} setValue={setValue} placeholder="Masukkan Foto Obat" isImagePicker={true} />
  </VStack>
)

const ToggleDetailsButton = ({ isDetailVisible, setDetailVisible }: any) => (
  <Button className="max-w-36 h-12 rounded-full" action="secondary" size="sm" onPress={() => setDetailVisible((prev: boolean) => !prev)}>
    <HStack space="md" className="items-center">
      <ButtonText className="text-white font-medium">Opsional</ButtonText>
      <ButtonIcon as={!isDetailVisible ? ChevronDownIcon : ChevronUpIcon} className="stroke-white" />
    </HStack>
  </Button>
)

const SubmitButton = ({ onSubmit }: any) => (
  <Button className="bg-amost-primary rounded-full w-full mt-28" size="xl" onPress={onSubmit}>
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