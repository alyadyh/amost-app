import { VStack } from "@/components/ui/vstack";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { ScrollView } from "@/components/ui/scroll-view";

type InfoLayoutProps = {
  children: React.ReactNode;
};

export const InfoLayout = (props: InfoLayoutProps) => {
  return (
    <SafeAreaView className="w-full h-full bg-white p-6">
      {props.children}
    </SafeAreaView>
  );
};
