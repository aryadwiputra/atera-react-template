import { type Asset } from '@/lib/data/types'
import { createAsset, getAsset, listAssets, removeAsset, updateAsset } from '@/lib/data/assets'

export interface AssetService {
  list(): Asset[]
  get(id: string): Asset | undefined
  create(input: Omit<Asset, 'id'>): Asset
  update(id: string, updates: Partial<Asset>): Asset | undefined
  remove(id: string): void
}

export const assetService: AssetService = {
  list: listAssets,
  get: getAsset,
  create: createAsset,
  update: updateAsset,
  remove: removeAsset,
}
