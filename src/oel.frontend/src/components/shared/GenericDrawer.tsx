import { createContext, useContext, useRef, type ComponentProps, type ReactNode } from "react";
import { Scroll, Sheet } from "@silk-hq/components";
import { X } from "lucide-react";

interface DrawerProps {
  allowImplicitDismissal?: boolean;
  children: ReactNode;
  dismissible?: boolean;
  onDismissed?: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  showCloseButton?: boolean;
}

const DrawerContext = createContext<{
  allowImplicitDismissal: boolean;
  dismissible: boolean;
  onDismissed?: () => void;
  showCloseButton: boolean;
} | null>(null);

function Drawer({
  allowImplicitDismissal = true,
  children,
  dismissible = true,
  onDismissed,
  onOpenChange,
  open,
  showCloseButton = true,
}: DrawerProps) {
  return (
    <Sheet.Root
      license="non-commercial"
      sheetRole="dialog"
      presented={open}
      onPresentedChange={onOpenChange}
    >
      <DrawerContext value={{ allowImplicitDismissal, dismissible, onDismissed, showCloseButton }}>
        {children}
      </DrawerContext>
    </Sheet.Root>
  );
}

function DrawerContent({
  children,
  className,
  ...props
}: ComponentProps<typeof Sheet.Content>) {
  const context = useContext(DrawerContext);
  const previousTravelStatusRef = useRef<string | undefined>(undefined);

  if (!context) {
    throw new Error("DrawerContent must be used inside Drawer");
  }

  return (
    <Sheet.Portal>
      <Sheet.View
        className="z-50 h-(--silk-100-lvh-dvh-pct)"
        nativeEdgeSwipePrevention
        swipeDismissal={context.allowImplicitDismissal && context.dismissible}
        onClickOutside={{
          dismiss: context.allowImplicitDismissal && context.dismissible,
          stopOverlayPropagation: true,
        }}
        onEscapeKeyDown={{
          dismiss: context.allowImplicitDismissal && context.dismissible,
          stopOverlayPropagation: true,
        }}
        onTravelStatusChange={(travelStatus) => {
          if (
            travelStatus === "idleOutside"
            && previousTravelStatusRef.current === "exiting"
          ) {
            context.onDismissed?.();
          }

          previousTravelStatusRef.current = travelStatus;
        }}
      >
        <Sheet.Backdrop
          className="bg-black"
          travelAnimation={{ opacity: [0, 0.5] }}
        />

        <Sheet.Content
          className={`relative grid h-auto max-h-[calc(var(--silk-100-lvh-dvh-pct)-1rem)] w-full max-w-screen-sm grid-rows-[minmax(0,1fr)] ${className ?? ""}`}
          {...props}
        >
          <Sheet.BleedingBackground className="rounded-t-xl border-t bg-background shadow-lg" />

          <Scroll.Root className="min-h-0">
            <Scroll.View
              className="h-full overscroll-contain"
              nativeScrollbar={false}
            >
              <Scroll.Content className="flex min-h-full w-full min-w-0 max-w-full flex-col pb-[env(safe-area-inset-bottom)]">
                {children}
              </Scroll.Content>
            </Scroll.View>
          </Scroll.Root>
        </Sheet.Content>
      </Sheet.View>
    </Sheet.Portal>
  );
}

function DrawerHeading({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error("DrawerHeading must be used inside Drawer");
  }

  return (
    <div
      className={`flex min-h-17 items-center justify-between gap-4 px-5 py-4 ${className ?? ""}`}
      {...props}
    >
      <div className="min-w-0 flex-1">{children}</div>
      {context.showCloseButton && context.dismissible && (
        <Sheet.Trigger
          type="button"
          action="dismiss"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label="Drawer schließen"
        >
          <X className="size-4" />
        </Sheet.Trigger>
      )}
    </div>
  );
}

function DrawerTitle(props: ComponentProps<typeof Sheet.Title>) {
  return <Sheet.Title {...props} />;
}

function DrawerDescription(props: ComponentProps<typeof Sheet.Description>) {
  return <Sheet.Description {...props} />;
}

export {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeading,
  DrawerTitle,
};
