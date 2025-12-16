import api from "@/utils/api";

export const fetchSubcription = async () => {
  try {
    const response = await api.get("/subscription/index");
    return response.data; 
  } catch (error) {
    console.error("Error fetching tests:", error);
    throw error;
  }
};

interface RazorpayCreateOrder {
  plan_id: number;
  plan_duration:String
}
export const selectSubscription = async (data: RazorpayCreateOrder) => {
  try {
    const response = await api.post("/subscription/createOrder", data);
    return response;
  } catch (error) {
    console.error("Error posting entry:", error);
    throw error;
  }
};

// verify integration

interface RazorpayVerify {
   razorpay_payment_id: string;
  razorpay_order_id:String;
  razorpay_signature:String
  plan_id:number

}
export const RazorpaySignatureVerification = async (data: RazorpayVerify) => {
  try {
    const response = await api.post("subscription/razorpay/verify", data);
    return response;
  } catch (error) {
    console.error("Error posting entry:", error);
    throw error;
  }
};

// subscription history

export const fetchSubcriptionHistory = async () => {
  try {
    const response = await api.get("/subscription/history");
    return response.data; 
  } catch (error) {
    console.error("Error fetching tests:", error);
    throw error;
  }
};


//Subscription status

export const fetchSubcriptionStatus = async () => {
  try {
    const response = await api.get("/subscription/planStatus");
    return response.data; 
  } catch (error) {
    console.error("Error fetching tests:", error);
    throw error;
  }
};

// Subscription planChange

interface planChange {
  package_id: number;
 
}

export const PlanChange = async (data:planChange) => {
  try {
    const response = await api.post("/subscription/changePlan", data);
    return response;
  } catch (error) {
    console.error("Error posting entry:", error);
    throw error;
  }
};

