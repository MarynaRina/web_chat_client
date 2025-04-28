import CountrySelect from "./CountrySelect";

const PhoneSelector = ({
  phone,
  setPhone,
  selectedCountry,
  setSelectedCountry,
}: {
  phone: string;
  setPhone: (val: string) => void;
  selectedCountry: { name: string; code: string };
  setSelectedCountry: (val: { name: string; code: string }) => void;
}) => {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-gradient-start to-gradient-end p-5 text-bgBase font-medium space-y-4">
      <div>
        <CountrySelect
          selectedCountry={selectedCountry}
          onChange={setSelectedCountry}
        />
      </div>

      <div>
        <div className="flex items-center space-x-3">
          <span className="mr-2 font-semibold">{selectedCountry.code}</span>
          <input
            type="tel"
            placeholder="___ ___ ___"
            className="bg-transparent outline-none w-full placeholder-black text-bgBase"
            value={phone}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,9}$/.test(value)) {
                setPhone(value);
              }
            }}
            inputMode="numeric"
            maxLength={9}
          />
        </div>
      </div>
    </div>
  );
};

export default PhoneSelector;