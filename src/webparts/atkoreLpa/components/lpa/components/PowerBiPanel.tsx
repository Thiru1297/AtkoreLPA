// @ts-nocheck
import { useEffect, useState } from 'react';
import { useLpaAppContext } from '../../../context/LpaAppContext';

interface IPowerBiPanelProps {
  configKey: string;
  title: string;
}

export function PowerBiPanel(props: IPowerBiPanelProps) {
  const { service } = useLpaAppContext();
  const [url, setUrl] = useState('');

  useEffect(() => {
    let mounted = true;
    service
      .getConfigurationValue(props.configKey)
      .then((value) => {
        if (mounted) {
          setUrl(value || '');
        }
      })
      .catch(() => {
        if (mounted) {
          setUrl('');
        }
      });
    return () => {
      mounted = false;
    };
  }, [props.configKey, service]);

  if (!url) {
    return null;
  }

  return (
    <div className="rounded-lg border border-[rgba(0,0,0,0.12)] bg-white p-3 md:p-4">
      <div className="mb-2 text-sm font-medium text-[#1B1B1B]">{props.title}</div>
      <iframe
        title={props.title}
        src={url}
        className="h-[420px] w-full rounded-md border-0"
        allowFullScreen
      />
    </div>
  );
}
