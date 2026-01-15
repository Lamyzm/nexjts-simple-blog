/**
 * Show - 조건부 렌더링 컴포넌트
 *
 * @example
 * ```tsx
 * // 레이아웃 유지 (권장)
 * <Show when={isVisible} keepLayout>
 *   <Content />
 * </Show>
 *
 * // 완전 제거
 * <Show when={hasData} fallback={<Empty />}>
 *   <DataView />
 * </Show>
 * ```
 */
export function Show({
  when,
  fallback,
  children,
  keepLayout = false,
}: {
  when: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
  keepLayout?: boolean;
}) {
  if (keepLayout) {
    return (
      <div
        data-visible={when}
        className="transition-opacity data-[visible=false]:opacity-0 data-[visible=false]:pointer-events-none"
      >
        {children}
      </div>
    );
  }

  return when ? <>{children}</> : <>{fallback}</>;
}
