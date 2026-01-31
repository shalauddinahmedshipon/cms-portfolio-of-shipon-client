import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatMonthYear(date?: string) {
  if (!date) return ""

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}


export const getProofType = (url?: string) => {
  if (!url) return null;
  const lower = url.toLowerCase();
  
  if (lower.endsWith(".pdf") || lower.includes("drive.google.com")) {
    return "pdf";
  }
  
  if (/\.(png|jpg|jpeg|webp|gif)$/i.test(lower)) {
    return "image";
  }
  
  // Check for known profile platforms
  const profilePlatforms = [
    "codeforces.com",
    "codechef.com", 
    "leetcode.com",
    "hackerrank.com",
    "atcoder.jp",
    "github.com",
    "linkedin.com"
  ];
  
  if (profilePlatforms.some(platform => lower.includes(platform))) {
    return "profile";
  }
  
  return "link";
};

export const getPlatformName = (url?: string) => {
  if (!url) return null;
  const lower = url.toLowerCase();
  
  if (lower.includes("codeforces.com")) return "Codeforces";
  if (lower.includes("codechef.com")) return "CodeChef";
  if (lower.includes("leetcode.com")) return "LeetCode";
  if (lower.includes("hackerrank.com")) return "HackerRank";
  if (lower.includes("atcoder.jp")) return "AtCoder";
  if (lower.includes("naukri.com")) return "AtCoder";
  if (lower.includes("github.com")) return "GitHub";
  if (lower.includes("linkedin.com")) return "LinkedIn";
  
  return null;
};
