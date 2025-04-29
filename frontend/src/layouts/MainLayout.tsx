import Header from "../components/Header";
import { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export default function MainLayout({ children }: Props) {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="p-4">{children}</main>
        </div>
    );
}
