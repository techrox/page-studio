// VideoEmbed — YouTube or Vimeo embed with caption. Parses the URL to
// extract the video ID and renders the standard responsive iframe.

function parseVideoUrl(url) {
  if (!url) return null;
  // YouTube: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/,
  );
  if (yt) return { provider: 'youtube', id: yt[1] };
  // Vimeo: vimeo.com/ID
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { provider: 'vimeo', id: vm[1] };
  return null;
}

export const VideoEmbed = {
  label: 'Video embed',
  fields: {
    video_url: {
      type: 'text',
      label: 'YouTube or Vimeo URL',
    },
    caption: { type: 'text', label: 'Caption (optional)' },
    max_width: {
      type: 'select',
      label: 'Max width',
      options: [
        { label: 'Narrow (720px)', value: 720 },
        { label: 'Comfortable (940px)', value: 940 },
        { label: 'Wide (1140px)', value: 1140 },
      ],
    },
    background: {
      type: 'radio',
      label: 'Background',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Soft', value: 'soft' },
        { label: 'Dark', value: 'dark' },
      ],
    },
  },
  defaultProps: {
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    caption: '',
    max_width: 940,
    background: 'white',
  },
  render: ({ video_url, caption, max_width, background }) => {
    const parsed = parseVideoUrl(video_url);
    const src =
      parsed?.provider === 'youtube'
        ? `https://www.youtube-nocookie.com/embed/${parsed.id}`
        : parsed?.provider === 'vimeo'
        ? `https://player.vimeo.com/video/${parsed.id}`
        : null;
    return (
      <section
        className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}${background === 'dark' ? ' tps-section-dark' : ''}`}
        style={{ paddingTop: 48, paddingBottom: 48 }}
      >
        <div className="tps-container" style={{ maxWidth: max_width }}>
          <div
            style={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              overflow: 'hidden',
              borderRadius: 'var(--tps-radius)',
              background: '#0F172A',
            }}
          >
            {src ? (
              <iframe
                src={src}
                title={caption || 'Embedded video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0,
                }}
              />
            ) : (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94A3B8',
                  fontSize: 13,
                }}
              >
                Paste a YouTube or Vimeo URL
              </div>
            )}
          </div>
          {caption && (
            <p
              style={{
                marginTop: 12,
                fontSize: 13,
                color: 'var(--tps-muted)',
                textAlign: 'center',
              }}
            >
              {caption}
            </p>
          )}
        </div>
      </section>
    );
  },
};
