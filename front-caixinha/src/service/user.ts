import { getUserIdByEmailAndUser } from "@/pages/api/api.carteira";

interface Input {
    email?: string;
    username?: string;
}

export async function getUserId(input: Input): Promise<string> {
    try {
        const data = await getUserIdByEmailAndUser(
            input.username,
            input.email
        )

        return data.id
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error(String(error));
        }
    }
}