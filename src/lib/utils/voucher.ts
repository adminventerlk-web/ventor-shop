/**
 * Verifies whether a student's input full name matches the registered name
 * on a student voucher record using exact, substring, or 3+ char token overlap.
 */
export function doesStudentNameMatch(
  registeredNameRaw?: string | null,
  inputNameRaw?: string | null
): boolean {
  const registeredName = (registeredNameRaw || '').trim().toLowerCase();
  const inputName = (inputNameRaw || '').trim().toLowerCase();

  if (!registeredName || !inputName) {
    return false;
  }

  const voucherParts = registeredName.split(/\s+/).filter(Boolean);
  const inputParts = inputName.split(/\s+/).filter(Boolean);
  const hasMatchingToken = voucherParts.some((vp: string) =>
    inputParts.some(
      (ip: string) =>
        (ip.length > 2 && vp.includes(ip)) || (vp.length > 2 && ip.includes(vp))
    )
  );

  return (
    registeredName === inputName ||
    registeredName.includes(inputName) ||
    inputName.includes(registeredName) ||
    hasMatchingToken
  );
}
