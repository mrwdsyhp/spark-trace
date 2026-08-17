import AsyncStorage from '@react-native-async-storage/async-storage';

const REGISTERED_HOUSE_KEY = 'registeredHouseId';

export interface RegisteredHouse {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  powerCapacity: number;
  profile: string;
}

/**
 * Save the registered house to AsyncStorage
 */
export async function saveRegisteredHouse(house: RegisteredHouse): Promise<void> {
  try {
    await AsyncStorage.setItem(REGISTERED_HOUSE_KEY, JSON.stringify(house));
  } catch (error) {
    console.error('Failed to save registered house:', error);
    throw error;
  }
}

/**
 * Get the registered house from AsyncStorage
 */
export async function getRegisteredHouse(): Promise<RegisteredHouse | null> {
  try {
    const houseJson = await AsyncStorage.getItem(REGISTERED_HOUSE_KEY);
    if (houseJson) {
      return JSON.parse(houseJson);
    }
    return null;
  } catch (error) {
    console.error('Failed to get registered house:', error);
    return null;
  }
}

/**
 * Get only the registered house ID
 */
export async function getRegisteredHouseId(): Promise<string | null> {
  try {
    const house = await getRegisteredHouse();
    return house?.id || null;
  } catch (error) {
    console.error('Failed to get registered house ID:', error);
    return null;
  }
}

/**
 * Clear the registered house (for house switching)
 */
export async function clearRegisteredHouse(): Promise<void> {
  try {
    await AsyncStorage.removeItem(REGISTERED_HOUSE_KEY);
  } catch (error) {
    console.error('Failed to clear registered house:', error);
    throw error;
  }
}

/**
 * Check if a house is registered
 */
export async function isHouseRegistered(): Promise<boolean> {
  const houseId = await getRegisteredHouseId();
  return houseId !== null;
}