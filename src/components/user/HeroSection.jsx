const HeroSection = () => {
    return (
        <div className="relative w-full max-w-[1500px] mx-auto mb-[-150px] z-0">
            {/* Amazon-style Banner Background */}
            <div className="bg-gradient-to-r from-[#111] to-[#222] h-[600px] relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center p-10">
                    <div className="text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Handcrafted with Love</h2>
                        <p className="text-xl text-[#CCC] mb-6">Up to 60% off on Handcrafted Items</p>
                        <a href="#products" className="inline-block bg-[var(--amz-yellow-btn)] border border-[#FCD200] hover:bg-[var(--amz-yellow-hover)] text-black font-medium py-2 px-6 rounded-md shadow-sm">
                            Shop Now
                        </a>
                    </div>
                </div>

                {/* Gradient Fade to bottom product grid */}
                <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-t from-[var(--amz-bg)] to-transparent" />
            </div>
        </div>
    );
};

export default HeroSection;
