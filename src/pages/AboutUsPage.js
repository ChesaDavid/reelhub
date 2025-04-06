export default function AboutUs() {
    return (
        <main className="min-h-screen bg-gray-900 text-white py-12 px-6">
            <div className="container mx-auto text-center">
                <h1 className="text-4xl font-bold mb-4">About Us</h1>
                <p className="text-lg mb-8">Your ultimate destination for watching the latest movies, timeless classics, and trending reels. We bring you an endless collection of entertainment at your fingertips.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
                        <p>To create a seamless platform where movie lovers can enjoy content from all genres, anytime and anywhere.</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-semibold mb-2">Why Choose Us?</h2>
                        <p>We provide a curated collection, personalized recommendations, and a user-friendly interface designed for effortless navigation.</p>
                    </div>
                </div>

                <div className="mt-12">
                    <h2 className="text-2xl font-semibold mb-4">Join Us Today!</h2>
                    <p>Experience a world of endless entertainment. Sign up now and dive into the magic of movies and reels!</p>
                </div>
            </div>
        </main>
    );
}
