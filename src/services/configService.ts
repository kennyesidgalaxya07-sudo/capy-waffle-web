/** Configuración global del negocio. CapyWaffles = groupId 2 en la base compartida. */
export const configService = {
  getGroupId(): number {
    const raw = import.meta.env["VITE_GROUP_ID"] as string | undefined;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : 2;
  },
};
