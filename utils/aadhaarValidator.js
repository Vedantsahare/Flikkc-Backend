export function validateAadhaar(aadhaar) {

  const aadhaarRegex = /^[0-9]{12}$/;

  return aadhaarRegex.test(aadhaar);

}