// eslint-disable-next-line import/prefer-default-export
export function appendNextParam(url: string): string {
  const params = new URLSearchParams({
    next: window.location.pathname,
  });

  return `${url}?${params.toString()}`;
}
