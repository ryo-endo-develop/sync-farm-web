export type PaginationProps = {
  currentPage: number // 現在のページ番号 (1始まり)
  totalPages: number // 総ページ数
  totalItems?: number // (オプション) 総アイテム数
  onPageChange: (page: number) => void // ページ変更時に呼び出される関数
  isLoading?: boolean // (オプション) ローディング状態 (ボタン無効化用)
  className?: string // 外部スタイル用
}
