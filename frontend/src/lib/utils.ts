import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import * as LucideIcons from "lucide-react"
import React from "react"

// Type utilities
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

// URL utilities
export function absoluteUrl(path: string) {
  if (typeof window !== 'undefined') return path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`
  return `http://localhost:${process.env.PORT ?? 3000}${path}`
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

// Format date
export function formatDate(date: Date | string | number) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Format date time
export function formatDateTime(date: Date | string | number) {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  })
}

// Format bytes
const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

export function formatBytes(
  bytes: number,
  decimals: number = 2,
  size: number = 0
): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${units[i]}`
}

// Truncate string
export function truncate(str: string, length: number) {
  if (str.length <= length) return str
  return `${str.substring(0, length)}...`
}

// Generate random ID
export function generateId(length: number = 8) {
  return Math.random()
    .toString(36)
    .substring(2, length + 2)
}

// Debounce function
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
) {
  let timeout: NodeJS.Timeout
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

// Format phone number
export function formatPhoneNumber(phoneNumber: string) {
  // Remove all non-digit characters
  const cleaned = ('' + phoneNumber).replace(/\D/g, '')
  
  // Check if number is valid
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  
  return phoneNumber
}

// Generate initials from name
export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Check if value is empty
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string' && value.trim() === '') return true
  if (Array.isArray(value) && value.length === 0) return true
  if (typeof value === 'object' && Object.keys(value).length === 0) return true
  return false
}

// Get object value by path
export function get(obj: any, path: string, defaultValue: any = undefined) {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj)
  
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/)
  return result === undefined || result === obj ? defaultValue : result
}

// Generate random number in range
export function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// Generate random color
export function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

// Copy to clipboard
export async function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (err) {
      console.error('Failed to copy text: ', err)
      return false
    }
  } else {
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    document.body.appendChild(textarea)
    textarea.select()
    
    try {
      document.execCommand('copy')
      return true
    } catch (err) {
      console.error('Failed to copy text: ', err)
      return false
    } finally {
      document.body.removeChild(textarea)
    }
  }
}

// Generate UUID
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Format number with commas
export function numberWithCommas(x: number | string) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Convert object to query string
export function objectToQueryString(obj: Record<string, any>): string {
  return Object.entries(obj)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
}

// Convert query string to object
export function queryStringToObject(queryString: string): Record<string, string> {
  return Object.fromEntries(new URLSearchParams(queryString))
}

// Generate slug from string
export function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Validate email
export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Validate URL
export function isValidUrl(string: string) {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

// Format file size
export function formatFileSize(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// Sleep function
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Class name merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Dynamic icon loader
export function dynamicIcon(name: string, props: React.SVGProps<SVGSVGElement> = {}) {
  const IconComponent = LucideIcons[name as keyof typeof LucideIcons] as React.ComponentType<React.SVGProps<SVGSVGElement>>;
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  return React.createElement(IconComponent, props);
}

// Icons component
export const Icons = {
  ...LucideIcons,
  dynamic: ({ name, ...props }: { name: string } & React.SVGProps<SVGSVGElement>) => 
    dynamicIcon(name, props)
}
