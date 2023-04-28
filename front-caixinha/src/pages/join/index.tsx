import { useRouter } from "next/router";

export default function Join() {
    const router = useRouter()

    console.log(router)

    return (
        <h1>Join</h1>
    )
}