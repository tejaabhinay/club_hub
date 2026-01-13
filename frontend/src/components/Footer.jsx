const Footer = () => {
    return (
      <footer className="bg-primary border-t border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} University Club Hub. All rights reserved.
          </p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
