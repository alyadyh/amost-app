import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type MedicationStackParamList = {
  Medication: undefined;
  MedicationDetail: { med: Medication };
};

export type MedicationStackNavigationProp = StackNavigationProp<MedicationStackParamList, 'Medication'>;
export type MedicationDetailRouteProp = RouteProp<MedicationStackParamList, 'MedicationDetail'>;

interface Medication {
  id: string;
  range: string;
  name: string;
  dose: string;
}
