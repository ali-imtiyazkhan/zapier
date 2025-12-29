import { ReactNode, MouseEventHandler } from "react";

type ButtonSize = "sm" | "lg";

type PrimaryButtonProps = {
    children: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    size?: ButtonSize;
};

export const PrimaryButton = ({
    children,
    onClick,
    size = "lg",
}: PrimaryButtonProps) => {
    const sizeClasses =
        size === "sm"
            ? "px-3 py-1 text-sm"
            : "px-6 py-3 text-base";

    return (
        <button
            onClick={onClick}
            className={`link-button cursor-pointer bg-amber-700  hover:bg-zinc-400 ${sizeClasses}`}
        >
            {children}
        </button>
    );
};
