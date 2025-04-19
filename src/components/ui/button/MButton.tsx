'use client';

import * as React from "react";
import { Ref } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "antd";
import { ButtonProps } from "antd/lib/button/button";
import "./index.scss";

type Props = { link?: string; innerRef?: Ref<HTMLButtonElement | HTMLAnchorElement> } &
    Omit<ButtonProps, 'ref'> &
    React.RefAttributes<HTMLButtonElement | HTMLAnchorElement>;

const MButton = ({ className, link, onClick, ...props }: Props) => {
    const router = useRouter();
    const defaultClass = "m-btn py-8 justify-center opacity-70-hover border-radius-xxl";
    if (!className) className = defaultClass;
    else className += " " + defaultClass;
    if (!onClick && link) {
        onClick = () => router.push(link);
    }
    switch (props.type) {
        case "default":
            className += " border-gray-70-hover bg-gray-20-hover ";
            className += props.disabled ? "text-gray-60" : "text-gray-70";
            break;
        case "link":
            if (props.disabled) {
                className += " text-blue-65";
            } else {
                className += " text-blue-100";
            }
            break;
        case "primary":
            if (props.ghost) {
                if (!props.disabled) {
                    className += props.danger ? " text-red-100" : " text-gray-100";
                }
            } else {
                className += " text-white";
                if (!props.disabled) {
                    className += props.danger ? "" : " bg-gray-100 bg-gray-100-hover";
                }
            }
            if (props.disabled) {
                className += " border-gray-45 bg-gray-45 bg-gray-45-hover";
                break;
            }
            break;
    }
    return <Button className={className} onClick={onClick} {...props} />;
};

export default MButton;

