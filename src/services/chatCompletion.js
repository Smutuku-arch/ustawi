import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const apiKey = import.meta.env.VITE_APP_OPENAI_KEY;

// Adjust if different
const AZURE_ENDPOINT  = "https://ict-mfkej162-swedencentral.cognitiveservices.azure.com";
const DEPLOYMENT_NAME = "ustawiai";          // EXACT deployment name
const API_VERSION     = "2024-05-01-preview";

export async function chatAI(messages) {
  if (!apiKey) throw new Error("Missing VITE_APP_OPENAI_KEY (Azure key).");

  const client = new ModelClient(AZURE_ENDPOINT, new AzureKeyCredential(apiKey));

  const response = await client
    .path(`/openai/deployments/${DEPLOYMENT_NAME}/chat/completions`)
    .post({
      queryParameters: { "api-version": API_VERSION },
      body: {
        messages,
        model: DEPLOYMENT_NAME,     // Must match deployment name
        temperature: 0.5,
        max_tokens: 800,
        top_p: 1.0
      }
    });

  if (response.status !== "200" || isUnexpected(response)) {
    const err = response.body?.error || response.body;
    throw new Error(
      `Azure OpenAI error (${response.status}): ${
        typeof err === "string" ? err : JSON.stringify(err)
      }`
    );
  }

  return response.body.choices[0].message;
}