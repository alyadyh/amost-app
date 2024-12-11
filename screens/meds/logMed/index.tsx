// Core dependencies
import React, { useEffect, useState } from "react"
import { router } from "expo-router"

// Components
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import { HStack } from "@/components/ui/hstack"
import { Heading } from "@/components/ui/heading"
import { Skeleton } from "@/components/ui/skeleton"
import { Pressable } from "@/components/ui/pressable"
import { ScrollView } from "@/components/ui/scroll-view"
import { ArrowLeftIcon, Icon } from "@/components/ui/icon"
import { Button, ButtonIcon } from "@/components/ui/button"
import { RefreshControl } from "@/components/ui/refresh-control"
import { useCustomToast } from "@/components/useCustomToast"
import ShareReport from "./components/ShareExport"
import { LogMedModal } from "./modal"

// Icons
import { CheckCircle, Circle, PencilLine, Share2, XCircle } from "lucide-react-native"

// Constants
import { Medicine, Log } from "@/constants/types"

// Utils and Libs
import { format, isToday, isYesterday, parseISO } from "date-fns"
import { id } from "date-fns/locale"
import { fetchUserProfile, fetchLog, fetchMedicines } from "@/lib/supabase"

// Layout
import MedLayout from "../layout"

interface GroupedLogs {
  [key: string]: Log[]
}

const groupLogsByDate = (logs: Log[]): GroupedLogs => {
  const groups: GroupedLogs = {}
  logs.forEach(log => {
    (groups[log.log_date] = groups[log.log_date] || []).push(log)
  })
  return groups
}

const sortLogsByDate = (groupedLogs: GroupedLogs): [string, Log[]][] => {
  return Object.entries(groupedLogs).sort(([dateA], [dateB]) => {
    return parseISO(dateB).getTime() - parseISO(dateA).getTime() // Newest to oldest
  })
}

const getDisplayDate = (dateString: string): string => {
  const date = parseISO(dateString)
  if (isToday(date)) return 'Hari ini'
  if (isYesterday(date)) return 'Kemarin'
  return format(date, 'dd MMMM yyyy', { locale: id })
}

const LogCard: React.FC<{ log: Log, onEdit: () => void }> = ({ log, onEdit }) => {
  const medName = log.med_name
  console.log('medName: ', medName)
  const borderColor = log.taken === true ? 'border-green-500' : log.taken === false ? 'border-red-500' : 'border-gray-400'
  const iconColor = log.taken === true ? 'text-green-500 stroke-green-500' : log.taken === false ? 'text-red-500 stroke-red-500' : 'text-gray-400 stroke-gray-400'
  const IconComponent = log.taken === true ? CheckCircle : log.taken === false ? XCircle : Circle

  const formattedTime = log.log_time ? log.log_time.slice(0, 5) : "00:00"

  const displayText = log.taken === true
    ? `Diminum pada pukul ${formattedTime}`
    : log.taken === false
    ? "Tidak diminum"
    : "Belum ada status log"

  return (
    <HStack
      space="sm"
      className={`items-center justify-between p-3 bg-white rounded-lg shadow border-2 ${borderColor}`}
    >
      <HStack space="lg" className="items-center">
        <Icon as={IconComponent} size="lg" className={iconColor} />
        <VStack className="items-left">
          <Text bold className="text-amost-secondary-dark_1">{medName}</Text>
          <Text size="sm" className="text-amost-secondary-dark_2">{displayText}</Text>
        </VStack>
      </HStack>

      <Button size="lg" variant="link" className="rounded-full p-3.5" onPress={onEdit}>
        <ButtonIcon as={PencilLine} className="stroke-amost-secondary-dark_1" />
      </Button>
    </HStack>
  )
}

const LogMedScreen = () => {
  const [userName, setUserName] = useState<string>('')
  const [showModal, setShowModal] = useState(false)
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null)
  const [selectedReminderTime, setSelectedReminderTime] = useState<string>()
  const [logs, setLogs] = useState<Log[]>([])
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [selectedLog, setSelectedLog] = useState<Log | null>(null) // New state
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const showToast = useCustomToast()

  const fetchData = async () => {
    try {
      const userProfile = await fetchUserProfile('user_id')
      setUserName(userProfile?.full_name || 'No Name')

      const fetchedMedicines = await fetchMedicines()
      if (fetchedMedicines) {
        setMedicines(fetchedMedicines)
      }

      const fetchedLog = await fetchLog()
      setLogs(fetchedLog ?? [])
    } catch (error) {
      console.error("Error fetching data:", error)
      showToast("Gagal mengambil data. Silakan coba lagi.", "error")
    } finally {
      setIsLoaded(true)
    }
  }

   // Function to handle pull-to-refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await fetchData()
    } catch (error) {
      showToast("Gagal melakukan refresh. Coba lagi.", "error")
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleOpenModal = async (log: Log) => {
    try {
      const med = medicines.find((medicine) => medicine.id === log.medicine_id)

      if (med) {
        setSelectedMed(med)
        setSelectedReminderTime(log.reminder_time)
        setSelectedLog(log) // Store the selected log
        setShowModal(true)
      } else {
        console.error("Medicine not found in log", log)
        showToast("Obat tidak ditemukan untuk log ini.", "error")
      }
    } catch (error) {
      console.error("Error opening modal:", error)
      showToast("Terjadi kesalahan saat membuka log. Coba lagi.", "error")
    }
  }

  const handleLogUpdate = (updatedLog: Log) => {
    try {
      setLogs((prevLogs) =>
        prevLogs.map((log) =>
          log.id === updatedLog.id
            ? updatedLog
            : log
        )
      )
      setShowModal(false)
      showToast("Log berhasil diperbarui!", "success")
    } catch (error) {
      console.error("Error updating log:", error)
      showToast("Gagal memperbarui log. Silakan coba lagi.", "error")
    }
  }

  const groupedLogs = groupLogsByDate(logs)
  const sortedLogs = sortLogsByDate(groupedLogs)

  return (
    <VStack space="3xl" className="flex-1">
      <HStack className="items-center justify-between">
        <HStack space="md" className="items-center">
          <Pressable onPress={() => router.back()}>
            <Icon as={ArrowLeftIcon} size="2xl" className="text-amost-secondary-dark_1" />
          </Pressable>
          <Heading size="2xl" className="text-amost-secondary-dark_1 font-black">Log</Heading>
        </HStack>
        <ShareReport userName={userName} />
      </HStack>

      {!isLoaded ? (
        // Skeleton loader for the medicine list
        <VStack space="md">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rounded"
              className="h-20 w-full"
              isLoaded={false}
            />
          ))}
        </VStack>
      ) : logs.length === 0 ? (
        <VStack className="flex-1 justify-center items-center">
          <Text className="text-amost-secondary-dark_2">Belum ada riwayat log obat</Text>
        </VStack>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#00A378"
              colors={['#00A378']}
            />
          }
        >
          {sortedLogs.map(([date, logs]: [string, Log[]]) => (
            <VStack key={date} space="md" className="mb-6">
              <Text size="lg" bold className="text-amost-secondary-dark_1">
                {getDisplayDate(date)}
              </Text>
              {logs.map((log) => (
                <LogCard key={log.id} log={log} onEdit={() => handleOpenModal(log)} />
              ))}
            </VStack>
          ))}
        </ScrollView>
      )}
      {selectedMed && selectedLog && (
        <LogMedModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          medicine={selectedMed}
          reminderTime={selectedReminderTime || "00:00"}
          logDate={selectedLog.log_date} // Pass the correct log date
          onLog={handleLogUpdate}
        />
      )}
    </VStack>
  )
}

export const LogMed = () => {
  return (
    <MedLayout>
      <LogMedScreen />
    </MedLayout>
  )
}
