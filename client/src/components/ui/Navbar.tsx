export default function Navbar() {
  return (
    <nav className="bg-white  w-full z-20 top-0 h-[10%] left-0 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-1">
        <div className="flex items-center justify-between h-14">
          <h1 className="text-2xl font-semibold tracking-widest text-gray-800">
            PINTERVIEW
          </h1>
          {/* <a
            href="#"
            className="px-4 py-2 bg-[#023e8a] font-bold text-white rounded-md hover:bg-indigo-700 transition"
          >
            Log in
          </a> */}
        </div>
      </div>
    </nav>
  );
}
