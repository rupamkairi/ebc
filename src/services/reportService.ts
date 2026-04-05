import { useAuthStore } from "@/store/authStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000/api";

const downloadCSV = async (endpoint: string, params: Record<string, string>, filename: string) => {
  const token = useAuthStore.getState().token;
  
  const queryString = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/report${endpoint}${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      let errorMessage = "Failed to download report";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // Fallback to status text
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
    
    return true;
  } catch (error) {
    console.error("Report download error:", error);
    throw error;
  }
};

export const reportService = {
  // Admin Endpoints
  admin: {
    downloadPlatformOverview: (start: Date, end: Date) => 
      downloadCSV("/admin/platform-overview", { startDate: start.toISOString(), endDate: end.toISOString() }, "platform-overview.csv"),
    downloadEnquiries: (start: Date, end: Date) => 
      downloadCSV("/admin/enquiries", { startDate: start.toISOString(), endDate: end.toISOString() }, "enquiries.csv"),
    downloadAppointments: (start: Date, end: Date) => 
      downloadCSV("/admin/appointments", { startDate: start.toISOString(), endDate: end.toISOString() }, "appointments.csv"),
    downloadEntities: (start: Date, end: Date) => 
      downloadCSV("/admin/entities", { startDate: start.toISOString(), endDate: end.toISOString() }, "entities-performance.csv"),
    downloadWalletTransactions: (start: Date, end: Date) => 
      downloadCSV("/admin/wallet-transactions", { startDate: start.toISOString(), endDate: end.toISOString() }, "wallet-transactions.csv"),
    downloadConferenceDiscussions: (start: Date, end: Date) => 
      downloadCSV("/admin/conference-discussions", { startDate: start.toISOString(), endDate: end.toISOString() }, "conference-discussions.csv"),
    downloadSupportQueries: (start: Date, end: Date) => 
      downloadCSV("/admin/support-queries", { startDate: start.toISOString(), endDate: end.toISOString() }, "support-queries.csv"),
    downloadSystemHealth: (start: Date, end: Date) => 
      downloadCSV("/admin/system-health", { startDate: start.toISOString(), endDate: end.toISOString() }, "system-health.csv"),
  },
  
  // Product Seller Endpoints
  productSeller: {
      downloadEnquiries: (start: Date, end: Date) => 
        downloadCSV("/product-seller/enquiries", { startDate: start.toISOString(), endDate: end.toISOString() }, "seller-enquiries.csv"),
      downloadEntityMetrics: (start: Date, end: Date) => 
        downloadCSV("/product-seller/entity-metrics", { startDate: start.toISOString(), endDate: end.toISOString() }, "seller-metrics.csv"),
      downloadWalletTransactions: (start: Date, end: Date) => 
        downloadCSV("/product-seller/wallet-transactions", { startDate: start.toISOString(), endDate: end.toISOString() }, "seller-wallet-transactions.csv"),
  },

  // Service Provider Endpoints
  serviceProvider: {
      downloadAppointments: (start: Date, end: Date) => 
        downloadCSV("/service-provider/appointments", { startDate: start.toISOString(), endDate: end.toISOString() }, "provider-appointments.csv"),
      downloadEntityMetrics: (start: Date, end: Date) => 
        downloadCSV("/service-provider/entity-metrics", { startDate: start.toISOString(), endDate: end.toISOString() }, "provider-metrics.csv"),
      downloadWalletTransactions: (start: Date, end: Date) => 
        downloadCSV("/service-provider/wallet-transactions", { startDate: start.toISOString(), endDate: end.toISOString() }, "provider-wallet-transactions.csv"),
  }
};
