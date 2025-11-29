const PLASMIC_CMS_HOST = process.env.PLASMIC_CMS_HOST || "https://morpheus.kreatale.com";
const PLASMIC_CMS_ID = process.env.PLASMIC_CMS_ID || "2oqg9M5sMusLqpGjGvA2nM";
const PLASMIC_CMS_PUBLIC_TOKEN = process.env.PLASMIC_CMS_PUBLIC_TOKEN || "xeHbDtzfcPFb59gFxZlUcESm9rnLJqq7tJQIupeOcLBO4ZE3epMlGee0sFxtJlLOfQcpDny2McUFCDJJA";
const PLASMIC_CMS_MODEL_ID = process.env.PLASMIC_CMS_MODEL_ID || "";

export interface PlasmicCMSResponse {
  rows: PlasmicCMSRow[];
}

export interface PlasmicCMSRow {
  id: string;
  createdAt: string;
  updatedAt: string;
  identifier: string;
  data: Record<string, unknown>;
}

function mapLocaleToPlasmic(locale: string): string {
  const localeMap: Record<string, string> = {
    en: "en-US",
    id: "id-ID",
  };
  return localeMap[locale] || locale;
}

function buildApiUrl(modelId: string, queryParams?: Record<string, string>): string {
  const baseUrl = `${PLASMIC_CMS_HOST}/api/v1/cms/databases/${PLASMIC_CMS_ID}/tables/${modelId}/query`;
  
  if (queryParams) {
    const params = new URLSearchParams(queryParams);
    return `${baseUrl}?${params.toString()}`;
  }
  
  return baseUrl;
}

async function fetchFromPlasmicCMS<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "x-plasmic-api-cms-tokens": `${PLASMIC_CMS_ID}:${PLASMIC_CMS_PUBLIC_TOKEN}`,
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Plasmic CMS API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getAllBlogPosts(locale?: string): Promise<PlasmicCMSRow[]> {
  if (!PLASMIC_CMS_MODEL_ID) {
    throw new Error("PLASMIC_CMS_MODEL_ID is not set. Please set it in your .env.local file.");
  }

  const queryParams: Record<string, string> = {
    "q.limit": "100",
    "q.offset": "0",
  };

  if (locale) {
    queryParams.locale = mapLocaleToPlasmic(locale);
  }

  const url = buildApiUrl(PLASMIC_CMS_MODEL_ID, queryParams);

  const data = await fetchFromPlasmicCMS<PlasmicCMSResponse>(url);
  return data.rows || [];
}

export async function getBlogPostBySlug(slug: string, locale?: string): Promise<PlasmicCMSRow | null> {
  if (!PLASMIC_CMS_MODEL_ID) {
    throw new Error("PLASMIC_CMS_MODEL_ID is not set. Please set it in your .env.local file.");
  }

  if (locale) {
    try {
      const allPosts = await getAllBlogPosts(locale);
      const matchingPost = allPosts.find(
        (row) => row.data.slug === slug
      );
      if (matchingPost) {
        return matchingPost;
      }
    } catch (error) {
      console.warn("Error fetching posts with locale for slug lookup:", error);
    }
  }

  const filterQuery = JSON.stringify({
    where: {
      slug: slug,
    },
    limit: 1,
    offset: 0,
  });

  const queryParams: Record<string, string> = {
    q: filterQuery,
  };

  if (locale) {
    queryParams.locale = mapLocaleToPlasmic(locale);
  }

  const url = buildApiUrl(PLASMIC_CMS_MODEL_ID, queryParams);

  const data = await fetchFromPlasmicCMS<PlasmicCMSResponse>(url);
  return data.rows && data.rows.length > 0 ? data.rows[0] : null;
}

export async function getBlogPostById(id: string): Promise<PlasmicCMSRow | null> {
  if (!PLASMIC_CMS_MODEL_ID) {
    throw new Error("PLASMIC_CMS_MODEL_ID is not set. Please set it in your .env.local file.");
  }

  const filterQuery = JSON.stringify({
    where: {
      _id: id,
    },
    limit: 1,
    offset: 0,
  });

  const url = buildApiUrl(PLASMIC_CMS_MODEL_ID, {
    q: filterQuery,
  });

  const data = await fetchFromPlasmicCMS<PlasmicCMSResponse>(url);
  return data.rows && data.rows.length > 0 ? data.rows[0] : null;
}

export async function getBlogPostByIdentifier(
  identifier: string,
  locale?: string
): Promise<PlasmicCMSRow | null> {
  if (!PLASMIC_CMS_MODEL_ID) {
    throw new Error("PLASMIC_CMS_MODEL_ID is not set. Please set it in your .env.local file.");
  }

  const filterQuery = JSON.stringify({
    where: {
      identifier: identifier,
    },
    limit: 1,
    offset: 0,
  });

  const queryParams: Record<string, string> = {
    q: filterQuery,
  };

  if (locale) {
    queryParams.locale = mapLocaleToPlasmic(locale);
  }

  const url = buildApiUrl(PLASMIC_CMS_MODEL_ID, queryParams);

  const data = await fetchFromPlasmicCMS<PlasmicCMSResponse>(url);
  return data.rows && data.rows.length > 0 ? data.rows[0] : null;
}

