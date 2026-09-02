import {
  useLocation,
  useNavigate,
  useParams as useRouterParams,
  useSearchParams as useRouterSearchParams,
} from "react-router-dom";

export function useRouter() {
  const navigate = useNavigate();
  return {
    push: (href: string) => {
      void navigate(href);
    },
    replace: (href: string) => {
      void navigate(href, { replace: true });
    },
    back: () => {
      void navigate(-1);
    },
    prefetch: () => {},
  };
}

export function usePathname() {
  return useLocation().pathname;
}

export function useParams<T extends Record<string, string | undefined> = Record<string, string>>() {
  return useRouterParams() as unknown as T;
}

export function useSearchParams() {
  const [params] = useRouterSearchParams();
  return params;
}

export function redirect(href: string): never {
  throw new Error(`redirect:${href}`);
}

export function notFound(): never {
  throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
}
