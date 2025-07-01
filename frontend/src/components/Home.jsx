import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [name, setName] = useState('');
    const navigate = useNavigate();


    const handleSubmit = (event) => {
        event.preventDefault();
        navigate('/chat', { state: { name } });
    };

    return (
        <div className='flex flex-col items-center justify-center mt-10'>
            <div className="bg-gray-100 p-8 rounded-xl shadow-lg w-full max-w-md ">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="nameInput" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            id="nameInput"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Jane Doe"
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full p-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Home;