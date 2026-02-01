import React from 'react';
import ContactDialog from '../contact/ContactDialog';

const Footer = () => {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-4">Let's Build Something Together</h2>
               <ContactDialog>
        <p className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition">
            Contact Me
          </p> 
               </ContactDialog>
          
        </div>
    );
};

export default Footer;