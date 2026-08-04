import { useState } from "react";
import { createOrder, verifyPayment } from "../features/conversion/api/conversionApi";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

export const useRazorpay = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, refreshUser } = useAuth();

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") {
        resolve(false);
        return;
      }
      
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const pay = async (planKey: "starter" | "pro_monthly" | "pro_yearly") => {
    if (!user) {
      toast.error("Please login to upgrade your plan");
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading("Initializing secure vault...");

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Failed to load payment gateway script");
      }

      // Create order on backend
      const order = await createOrder(planKey);

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "QuickMP3",
        description: order.planDetails.description,
        order_id: order.orderId,
        handler: async (response: any) => {
          const verifyToast = toast.loading("Verifying signature...");
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            
            await refreshUser();
            toast.success("Welcome to Premium status!", { id: verifyToast });
            
            // Redirect or refresh
            window.location.href = "/dashboard?payment=success";
          } catch (err: any) {
            toast.error(err.message || "Verification failed", { id: verifyToast });
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email,
        },
        theme: {
          color: "#8455ef",
        },
        modal: {
          ondismiss: () => {
            toast.dismiss(loadingToast);
            setIsProcessing(false);
            toast.error("Payment cancelled");
          }
        }
      };

      toast.dismiss(loadingToast);
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.dismiss(loadingToast);
      toast.error(err.message || "Payment initialization failed");
      setIsProcessing(false);
    }
  };

  return {
    pay,
    isProcessing,
  };
};
