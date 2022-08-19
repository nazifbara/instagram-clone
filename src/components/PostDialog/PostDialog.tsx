import { CSSProperties } from '@stitches/react'
import { MouseEventHandler } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'

import {
  IconButton,
  Icons,
  Box,
  Separator,
  Avatar,
  Link,
  ActionDialog,
  PostActionBar,
  Text,
  Dialog,
} from '..'
import { Post } from '../../types'
import { Profile } from '../../models'

type ContentProps = {
  profile: Profile | null
  css?: CSSProperties
  isOwner: boolean
  post: Post
  currentIndex?: number
  currentImgSrc: string
  lastIndex?: number
  onBackClick?: MouseEventHandler<HTMLButtonElement>
  onNextClick?: MouseEventHandler<HTMLButtonElement>
  handlePostDelete: (id: string) => () => void
}

export const Content = ({
  css,
  handlePostDelete,
  isOwner,
  profile,
  post,
  currentImgSrc,
  currentIndex,
  lastIndex,
  onBackClick,
  onNextClick,
}: ContentProps): JSX.Element => {
  return (
    <Dialog.Portal>
      <Dialog.Content
        css={{
          zIndex: 1,
          width: '85%',
          height: '95%',
          borderRadius: '0 0.75rem 0.75rem 0',
          ...css,
        }}
      >
        {lastIndex !== undefined && currentIndex !== undefined && (
          <>
            {lastIndex - currentIndex !== lastIndex && (
              <PostNavButton onClick={onBackClick} side="left" offset="-5%" />
            )}
            {lastIndex - currentIndex !== 0 && (
              <PostNavButton onClick={onNextClick} side="right" offset="-5%" />
            )}
          </>
        )}
        <Box
          css={{
            height: '100%',
            width: '100%',
            display: 'flex',
          }}
        >
          <ImgBox imgSrc={currentImgSrc} />
          <Separator orientation="vertical" />
          <CaptionBox
            profile={profile}
            post={post}
            isOwner={isOwner}
            handlePostDelete={handlePostDelete}
          />
        </Box>
      </Dialog.Content>
    </Dialog.Portal>
  )
}

const ImgBox = ({ imgSrc }: { imgSrc: string }): JSX.Element => (
  <Box
    css={{
      height: '100%',
      width: '62%',
      display: 'flex',
      backgroundImage: `url("${imgSrc}")`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  />
)

type CaptionBoxProps = {
  profile: Profile | null
  isOwner: boolean
  post: Post
  handlePostDelete: (id: string) => () => void
}

const CaptionBox = ({ isOwner, handlePostDelete, post, profile }: CaptionBoxProps): JSX.Element => (
  <Box css={{ width: '38%' }}>
    <Box css={{ display: 'flex', justifyContent: 'flex-end' }}></Box>
    <Box css={{ display: 'flex', alignItems: 'center', mx: '1rem', height: '3.75rem' }}>
      <Avatar
        src={profile?.photoLink ?? ''}
        fallback="u"
        alt={profile?.fullName ?? ''}
        size="1.75rem"
        css={{ marginRight: '0.75rem' }}
      />
      <Link to={`/app/${post.owner}`}>{post.owner}</Link>
      <Box css={{ flexGrow: '1' }} />
      {isOwner && (
        <ActionDialog.Root>
          <IconButton as={ActionDialog.Trigger} css={{ color: '$textBase' }}>
            <DotsHorizontalIcon fontSize="18px" />
          </IconButton>
          <ActionDialog.Content>
            <ActionDialog.Option kind="danger" onClick={handlePostDelete(post.id)}>
              Delete
            </ActionDialog.Option>
          </ActionDialog.Content>
        </ActionDialog.Root>
      )}
      <Dialog.Close css={{ pl: '2rem' }}>
        <Icons.Close />
      </Dialog.Close>
    </Box>
    <Separator orientation="horizontal" />
    <Box css={{ p: '0.875rem 1rem', height: '60%' }}>
      {post.caption && (
        <Box css={{ display: 'flex', alignItems: 'center' }}>
          <Box css={{ width: '2rem', mr: '.5rem' }}>
            <Avatar
              size="1.75rem"
              src={profile?.photoLink ?? ''}
              fallback="u"
              alt={profile?.fullName ?? ''}
            />
          </Box>

          <Box css={{ display: 'inline' }}>
            <Text bold css={{ mr: '0.3125rem' }}>
              {post.owner}
            </Text>
            <Text as="p" css={{ display: 'inline' }}>
              {post.caption}
            </Text>
          </Box>
        </Box>
      )}
    </Box>
    <Separator orientation="horizontal" />
    <Box as="section" css={{ p: '0.875rem 1rem' }}>
      <PostActionBar post={post} />

      <Box css={{ mb: '0.5rem' }}>
        <Text bold>{post.likeCount || 0} likes</Text>
      </Box>
    </Box>
  </Box>
)

type PostNavButtonProps = {
  side: 'left' | 'right'
  offset?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
}
const PostNavButton = ({ side, offset = '2rem', onClick }: PostNavButtonProps) => (
  <IconButton
    onClick={onClick}
    css={{
      position: 'fixed',
      display: 'flex',
      wh: '2.5rem',
      justifyContent: 'center',
      alignItems: 'center',
      left: side === 'left' ? offset : 'initial',
      right: side === 'right' ? offset : 'initial',
      top: '50%',
      borderRadius: '50%',
      backgroundColor: '$accentBg',
      transform: `rotate(${side === 'left' ? '-90deg' : '90deg'}) translateY(-50%)`,
      '&:hover': {
        backgroundColor: '$accentBgHover',
      },
    }}
  >
    <Icons.Chevron />
  </IconButton>
)

export { Root } from '../Dialog'
