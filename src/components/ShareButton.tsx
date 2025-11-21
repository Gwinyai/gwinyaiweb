'use client';

import { useState, useEffect, useRef } from 'react';
import { FaShareAlt, FaTwitter, FaFacebook, FaLinkedin, FaLink, FaCheck } from 'react-icons/fa';
import styles from './ShareButton.module.css';

interface ShareButtonProps {
  title: string;
  url: string;
}

export default function ShareButton({ title, url }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className={styles.shareContainer} ref={dropdownRef}>
      <button
        className={styles.shareButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Share this post"
      >
        <FaShareAlt className={styles.shareIcon} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <button
            className={styles.shareOption}
            onClick={() => handleShare('twitter')}
          >
            <FaTwitter className={styles.optionIcon} />
            <span>Share on Twitter</span>
          </button>

          <button
            className={styles.shareOption}
            onClick={() => handleShare('facebook')}
          >
            <FaFacebook className={styles.optionIcon} />
            <span>Share on Facebook</span>
          </button>

          <button
            className={styles.shareOption}
            onClick={() => handleShare('linkedin')}
          >
            <FaLinkedin className={styles.optionIcon} />
            <span>Share on LinkedIn</span>
          </button>

          <button
            className={styles.shareOption}
            onClick={handleCopyLink}
          >
            {copied ? (
              <>
                <FaCheck className={styles.optionIcon} />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <FaLink className={styles.optionIcon} />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

