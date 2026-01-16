export type UserInfo = {
    name: string;
    picture: string;
    email: string;
};

// Replace with a valid Google Client ID or use a placeholder
const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com";
const SCOPE = "https://www.googleapis.com/auth/generative-language.retriever"; // Adjust as needed for specific models

interface TokenResponse {
    blur?: any;
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
    error?: any;
}

// Initialize the Google Token Client
export const initGoogleAuth = (callback: (token: string) => void) => {
    if (typeof window === "undefined" || !window.google) {
        console.error("Google Scripts not loaded");
        return;
    }

    const client = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPE,
        callback: (response: TokenResponse) => {
            if (response.access_token) {
                callback(response.access_token);
            } else {
                console.error("No access token received", response);
            }
        },
    });

    return client;
};

// Generate Image using Gemini API
export const generateImageWithGemini = async (
    token: string,
    prompt: string,
    config: { aspectRatio: string; resolution: string; format: string },
    references: File[] = []
) => {
    const MODEL = "gemini-3-pro-image-preview"; // As requested
    const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

    // Convert files to base64 if needed (Gemini Multimodal)
    // Logic: For each file, read as Base64.
    const imageParts = await Promise.all(
        references.map(async (file) => {
            const base64Data = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result as string;
                    // remove data:image/xxx;base64, prefix
                    resolve(result.split(",")[1]);
                };
                reader.readAsDataURL(file);
            });
            return {
                inline_data: {
                    mime_type: file.type,
                    data: base64Data,
                },
            };
        })
    );

    const payload = {
        contents: [
            {
                parts: [
                    { text: prompt },
                    ...imageParts, // Append reference images
                ],
            },
        ],
        // Hypothetical config structure for "Nano Banana" schema
        generation_config: {
            aspect_ratio: config.aspectRatio,
            image_size: config.resolution === "4K" ? "4K" : undefined, // Trigger Pro
            response_mime_type: config.format === "JPEG" ? "image/jpeg" : "image/png",
        },
    };

    try {
        const response = await fetch(ENDPOINT, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                throw new Error("AUTH_ERROR");
            }
            const err = await response.json();
            throw new Error(err.error?.message || "Generation failed");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};
