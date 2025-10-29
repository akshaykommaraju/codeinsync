import logo from "@/assets/logo.svg"
import illustration from "@/assets/illustration.svg"
import FormComponent from "@/components/forms/FormComponent"
// import Footer from "@/components/common/Footer";

function HomePage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-16">
            <div className="my-12 flex h-full min-w-full flex-col items-center justify-evenly sm:flex-row sm:pt-0">
                <div className="flex w-full animate-up-down justify-center sm:w-1/2 sm:pl-4">
                    <img
                        src={illustration}
                        alt="Home illustration"
                        className="mx-auto w-[320px] sm:w-[560px]"
                    />
                </div>
                <div className="flex w-full items-center justify-center sm:w-1/2">
                    <div className="flex w-full max-w-[500px] flex-col items-center gap-6 p-4 sm:p-8">
                        <FormComponent />
                    </div>
                </div>
            </div>
            {/* <Footer /> */}
        </div>
    )
}

export default HomePage

