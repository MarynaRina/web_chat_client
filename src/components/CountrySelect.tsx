import { Listbox } from '@headlessui/react';

const countries = [
  { name: 'Poland', code: '+48' },
  { name: 'Ukraine', code: '+380' },
  { name: 'Germany', code: '+49' }
];

export default function CountrySelect({
  selectedCountry,
  onChange
}: {
  selectedCountry: { name: string; code: string };
  onChange: (val: { name: string; code: string }) => void;
}) {
  return (
    <Listbox value={selectedCountry} onChange={onChange}>
      <div className="relative">
        <Listbox.Button
          className="w-full  py-2 rounded-xl bg-transparent text-left text-bgBase font-semibold appearance-none outline-none"
        >
          {selectedCountry.name}
        </Listbox.Button>

        <Listbox.Options
          className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white text-bgBase shadow-lg z-10"
        >
          {countries.map((country) => (
            <Listbox.Option
              key={country.code}
              value={country}
              className={({ active }) =>
                `cursor-pointer px-4 py-2 ${
                  active ? 'bg-blue-100/60' : ''
                }`
              }
            >
              {country.name}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}