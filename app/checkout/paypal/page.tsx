import PaypalButton from "@/components/ui/PaypalButton";


export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          PayPal Payment Demo
        </h1>
        
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Product Name</h3>
            <p className="text-gray-600 mb-4">Product description here</p>
            <p className="text-3xl font-bold text-blue-600">$10.00</p>
          </div>
          
          <PaypalButton />
        </div>
      </div>
    </main>
  );
}