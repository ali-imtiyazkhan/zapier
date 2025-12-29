import { ReactNode, MouseEventHandler } from "react";

type LinkButtonProps = {
    children: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
};

export const LinkButton = ({ children, onClick }: LinkButtonProps) => {
    return (
        <button
            onClick={onClick}
            className="link-button px-2 py-4 cursor-pointer hover:bg-zinc-400"
        >
            {children}
        </button>
    );
};
