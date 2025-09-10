"use client"

import { 
  LucideProps, 
  LayoutDashboard, 
  Users as UsersIcon, 
  Building2 as Building2Icon, 
  Handshake, 
  CheckSquare as CheckSquareIcon, 
  Settings as SettingsIcon, 
  Bell as BellIcon, 
  User as UserIcon, 
  FileText as FileTextIcon, 
  MoreHorizontal as MoreHorizontalIcon, 
  Pencil as PencilIcon, 
  Trash2 as Trash2Icon, 
  Globe as GlobeIcon, 
  CircleDollarSign as CircleDollarSignIcon, 
  Building as BuildingIcon, 
  BarChart3 as BarChart3Icon, 
  ChevronLeft as ChevronLeftIcon,
  X as XIcon,
  LogIn as LogInIcon,
  Plus as PlusIcon,
  CreditCard as CreditCardIcon,
  Download as DownloadIcon,
  Megaphone as MegaphoneIcon
} from "lucide-react"

// Re-export all Lucide icons with dynamic imports
export const Icons = {
  // Core
  logo: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  spinner: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  
  // Navigation (direct imports to avoid dynamic overhead)
  layoutDashboard: (props: LucideProps) => <LayoutDashboard {...props} />,
  users: (props: LucideProps) => <UsersIcon {...props} />,
  building2: (props: LucideProps) => <Building2Icon {...props} />,
  handshake: (props: LucideProps) => <Handshake {...props} />,
  checkSquare: (props: LucideProps) => <CheckSquareIcon {...props} />,
  settings: (props: LucideProps) => <SettingsIcon {...props} />,
  bell: (props: LucideProps) => <BellIcon {...props} />,
  user: (props: LucideProps) => <UserIcon {...props} />,
  fileText: (props: LucideProps) => <FileTextIcon {...props} />,
  moreHorizontal: (props: LucideProps) => <MoreHorizontalIcon {...props} />,
  pencil: (props: LucideProps) => <PencilIcon {...props} />,
  trash2: (props: LucideProps) => <Trash2Icon {...props} />,
  globe: (props: LucideProps) => <GlobeIcon {...props} />,
  circleDollarSign: (props: LucideProps) => <CircleDollarSignIcon {...props} />,
  building: (props: LucideProps) => <BuildingIcon {...props} />,
  barChart3: (props: LucideProps) => <BarChart3Icon {...props} />,
  chevronLeft: (props: LucideProps) => <ChevronLeftIcon {...props} />,
  x: (props: LucideProps) => <XIcon {...props} />,
  logIn: (props: LucideProps) => <LogInIcon {...props} />,
  plus: (props: LucideProps) => <PlusIcon {...props} />,
  creditCard: (props: LucideProps) => <CreditCardIcon {...props} />,
  download: (props: LucideProps) => <DownloadIcon {...props} />,
  megaphone: (props: LucideProps) => <MegaphoneIcon {...props} />,
  
  // Social Media
  google: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
    </svg>
  ),
  twitter: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    </svg>
  ),
  github: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  linkedin: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  ),
  mail: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm16 12V6H8v10H4v2h16v-2h-4zm-7-7H6v-2h7V6h2v3h7v2h-7v3h-2z" />
    </svg>
  ),
}