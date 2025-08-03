import { showError } from "./showError";

const CHECK_AUTH = `
 query {
    checkAuth {
      id
      firstName
      lastName
      email
      isVerified
      profile {
        avatar
      }
    }
  }
`

export const checkAuth = async (token: string | null) => {
    try {
        const res = await fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                query: CHECK_AUTH,
            }),
        });


        const { errors } = await res.json();

        if (errors) {
            showError("Error in auth checking")
        }

    } catch (err) {
        showError("Error in auth checking")
    }
}