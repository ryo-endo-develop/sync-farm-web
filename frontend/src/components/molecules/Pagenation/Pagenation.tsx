import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

import { Button } from '../../atoms/Button/Button'
import { Icon } from '../../atoms/Icon/Icon'
import { Text } from '../../atoms/Text/Text'
import * as styles from './Pagenation.css'
import { PaginationProps } from './Pagenation.types'

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  isLoading = false,
  className
}) => {
  // ページ数が1以下、または無効なページ数の場合は何も表示しない
  if (totalPages <= 1 || currentPage < 1 || currentPage > totalPages) {
    return null
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <nav
      aria-label="ページネーション"
      className={`${styles.container} ${className || ''}`}
    >
      {/* 前へボタン */}
      <Button
        onClick={handlePrevious}
        disabled={currentPage === 1 || isLoading}
        variant="outline"
        size="sm"
        aria-label="前のページへ"
        iconLeft={<Icon as={ChevronLeft} size="1em" />} // アイコンを追加
      >
        前へ
      </Button>

      {/* ページ情報 */}
      <Text fontSize="sm" color="textSecondary" className={styles.pageInfo}>
        {currentPage} / {totalPages} ページ
        {totalItems !== undefined && ` (${totalItems} 件)`}
      </Text>

      {/* 次へボタン */}
      <Button
        onClick={handleNext}
        disabled={currentPage === totalPages || isLoading}
        variant="outline"
        size="sm"
        aria-label="次のページへ"
        iconRight={<Icon as={ChevronRight} size="1em" />} // アイコンを追加
      >
        次へ
      </Button>
    </nav>
  )
}
