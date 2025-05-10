const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-6 mt-8">
            <div className="container mx-auto text-center text-sm">
                &copy; {new Date().getFullYear()} GameGear. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
