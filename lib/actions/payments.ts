const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const paymentCheckOutVerify = async (sessionId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/payments/checkout-verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }),
    });
    return await response.json();
  } catch (error) {
    // Never break the success page over the verification call.
    console.error("paymentCheckOutVerify failed:", error);
    return { success: false, message: "Payment verification is unavailable" };
  }
};
