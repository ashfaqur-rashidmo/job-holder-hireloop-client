import { JobFormData } from "@/app/dashboard/recruiter/jobs/new/page"

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const createJob = async (data: JobFormData) => {
    const res = await fetch(`${baseURL}/jobs`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    return res.json()

}