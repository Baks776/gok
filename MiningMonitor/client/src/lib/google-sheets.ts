import { apiRequest } from "./queryClient";

export async function submitOrderToGoogleSheets(orderData: {
  customerName: string;
  phoneNumber: string;
  productId: number;
  productName: string;
  quantity: number;
  preferredDate: string;
  preferredTime: string;
}) {
  try {
    const response = await apiRequest('POST', '/api/google-sheets/orders', orderData);
    return await response.json();
  } catch (error) {
    console.error('Error submitting order to Google Sheets:', error);
    throw error;
  }
}

export async function getOrdersFromGoogleSheets() {
  try {
    const response = await fetch('/api/google-sheets/orders', {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching orders from Google Sheets:', error);
    throw error;
  }
}

export async function updateInventoryInGoogleSheets(inventoryData: Array<{
  id: number;
  name: string;
  currentAmount: number;
  capacity: number;
}>) {
  try {
    const response = await apiRequest('POST', '/api/google-sheets/inventory', { inventory: inventoryData });
    return await response.json();
  } catch (error) {
    console.error('Error updating inventory in Google Sheets:', error);
    throw error;
  }
}
