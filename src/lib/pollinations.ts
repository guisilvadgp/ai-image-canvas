const API_KEY = "pk_hnegNFUbL3mgrpHB";
const BASE_URL = "https://gen.pollinations.ai";

export interface ImageModel {
  name: string;
  description?: string;
}

export interface GenerateImageParams {
  prompt: string;
  model: string;
  width: number;
  height: number;
  seed?: number;
  enhance?: boolean;
  negative_prompt?: string;
  nologo?: boolean;
  safe?: boolean;
}

export const IMAGE_MODELS: ImageModel[] = [
  { name: "flux", description: "High quality, balanced speed" },
  { name: "turbo", description: "Fast generation, good quality" },
  { name: "gptimage", description: "GPT-powered image generation" },
  { name: "kontext", description: "Context-aware generation" },
  { name: "seedream", description: "Dreamlike artistic style" },
  { name: "nanobanana", description: "Efficient, quick results" },
];

export const ASPECT_RATIOS = [
  { name: "1:1", width: 1024, height: 1024, label: "Square" },
  { name: "16:9", width: 1920, height: 1080, label: "Widescreen" },
  { name: "9:16", width: 1080, height: 1920, label: "Portrait" },
  { name: "4:3", width: 1024, height: 768, label: "Standard" },
  { name: "3:4", width: 768, height: 1024, label: "Portrait 4:3" },
  { name: "21:9", width: 2560, height: 1080, label: "Ultrawide" },
];

export async function generateImage(params: GenerateImageParams): Promise<string> {
  const {
    prompt,
    model = "flux",
    width = 1024,
    height = 1024,
    seed,
    enhance = false,
    negative_prompt,
    nologo = true,
    safe = false,
  } = params;

  const encodedPrompt = encodeURIComponent(prompt);
  
  const queryParams = new URLSearchParams({
    model,
    width: width.toString(),
    height: height.toString(),
    nologo: nologo.toString(),
    enhance: enhance.toString(),
    safe: safe.toString(),
  });

  if (seed !== undefined) {
    queryParams.append("seed", seed.toString());
  }

  if (negative_prompt) {
    queryParams.append("negative_prompt", negative_prompt);
  }

  const url = `${BASE_URL}/image/${encodedPrompt}?${queryParams.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to generate image: ${response.statusText}`);
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export async function generateMultipleImages(
  params: GenerateImageParams,
  count: number
): Promise<string[]> {
  const promises: Promise<string>[] = [];

  for (let i = 0; i < count; i++) {
    const seedOffset = params.seed !== undefined ? params.seed + i : Math.floor(Math.random() * 1000000) + i;
    promises.push(
      generateImage({
        ...params,
        seed: seedOffset,
      })
    );
  }

  return Promise.all(promises);
}
