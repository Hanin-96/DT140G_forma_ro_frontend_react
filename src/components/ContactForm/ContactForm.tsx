import { useState } from "react"
import React from 'react';
import emailjs from '@emailjs/browser';
import ReCAPTCHA from "react-google-recaptcha";
import ContactStyle from './ContactStyle.module.css';

//Lucide ikon
import { ChevronDown, ChevronUp, Send } from 'lucide-react';


function ContactForm() {
    const [toggleContactForm, setToggleContactForm] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    //EmailJS states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [subject, setSubject] = useState("");

    //const [captchaOk, setCaptchaOk] = useState(false);
    const [skickat, setSkickat] = useState(false);
    const [formError, setFormError] = useState("");


    //reCAPCTHA state
    const siteKey_RECAPTCHA: string = import.meta.env.VITE_SITEKEY_RECAPTCHA || "";
    const [captchaResponse, setCaptchaResponse] = useState<string | null>("");

    // Skicka reCAPTCHA-responsen till state när användaren bekräftar
    const handleCaptcha = (value: string | null) => {
        if (value) {
            setCaptchaResponse(value);
            //setCaptchaOk(true);
        } else {
            //setCaptchaOk(false);
            setCaptchaResponse(null);
        }
    };


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        //Hindrar automatisk redirect
        e.preventDefault();

        //HoneyPot kontroll
        const honeyPotField = (e.target as HTMLFormElement)["honeypot"].value;

        if (honeyPotField) {
            setFormError("Formuläret skickades inte. Möjlig spam.");
            return;
        }


        if (!captchaResponse) {
            setFormError("Vänligen bekräfta att du inte är en robot.");
            return;
        }


        //Template för emailJS formulär
        const templateParams = {
            from_name: name,
            from_email: email,
            to_name: "Forma Ro test",
            subject: subject,
            message: message,
            "g-recaptcha-response": captchaResponse,
        }

        console.log(templateParams);

        const serviceId: string = import.meta.env.VITE_SERVICEID || "";
        const templateId: string = import.meta.env.VITE_TEMPLATEID || "";
        const publicKey: string = import.meta.env.VITE_PUBLICKEY || "";

        emailjs.send(serviceId, templateId, templateParams, publicKey)
            .then((response) => {
                console.log("Formuläret har skickats", response);
                setName("");
                setEmail("");
                setSubject("");
                setMessage("");
                //setCaptchaOk(false);
                setCaptchaResponse(null);
                setSkickat(true);
            })
            .catch((error) => {
                console.error("Fel, det gick inte att skicka formuläret", error);
                setFormError("Fel. Det gick inte att skicka formuläret - Serverfel")
            })
    }

    const toggleForm = (toggleOpen: boolean) => {
        setToggleContactForm(toggleOpen);
        if (!toggleOpen) {
            setTimeout(() => {
                setIsOpen(toggleOpen);
            }, 500);
        } else {
            setIsOpen(toggleOpen);
        }

    }

    return (
        <>
            <div className={"w-full max-w-[60rem] mx-auto mt-10 bg-white shadow-lg"}>
                <button onClick={() => toggleForm(!toggleContactForm)} className="bg-forma_ro_green relative max-w-[60rem] p-4 w-full text-forma_ro_btn">
                    Kontakta Forma Ro
                    {(!toggleContactForm) ? (<ChevronDown className="inline absolute m-4 right-0 top-0" />) : <ChevronUp className="inline absolute m-4 right-0 top-0" />}
                </button>



                {isOpen && (
                    <div>
                        <form onSubmit={handleSubmit} className={`${ContactStyle.contactFormContainer} ${toggleContactForm ? ContactStyle.contactFormSlideDown : ContactStyle.contactFormSlideUp}`}>
                            <div className="p-8">
                                <div>
                                    <label htmlFor="namn">Namn:</label>
                                    <input
                                        type="text"
                                        name="namn"
                                        placeholder="Ditt namn"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="epost">E-post:</label>
                                    <input
                                        type="email"
                                        name="epost"
                                        placeholder="Din e-post"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="subject">Ämne:</label>
                                    <select name="subject" id="subject" required value={subject} onChange={(e) => setSubject(e.target.value)}>
                                        <option value="Ayurveda">Ayurveda</option>
                                        <option value="Keramik">Keramik</option>
                                        <option value="Övrigt">Övrigt</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="message">Meddelande:</label>
                                    <textarea
                                        className="bg-white"
                                        name="message"
                                        placeholder="Ditt meddelande"
                                        required
                                        value={message}
                                        rows={5}
                                        onChange={(e) => setMessage(e.target.value)}
                                    ></textarea>
                                </div>

                                {/* Honeypot field (osynligt för användaren) */}
                                <input
                                    type="text"
                                    name="honeypot"
                                    style={{ display: 'none', visibility: 'hidden', position: 'absolute' }}
                                    tabIndex={-1}
                                />


                                <ReCAPTCHA className="m-8"
                                    sitekey={siteKey_RECAPTCHA}
                                    onChange={handleCaptcha}
                                />
                            </div>

                            {formError && <p>{formError}</p>}
                            <button type="submit" className=" bg-forma_ro_green p-4 w-full text-forma_ro_btn">Skicka <Send className="inline" /></button>

                        </form>
                    </div>
                )}
            </div>
        </>
    )
}

export default ContactForm