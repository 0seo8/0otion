'use client';
import { useQuery } from 'convex/react';
import { FileIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { Item } from '@/app/(main)/_components/item';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';

interface DocumentListProps {
  parentDocumentId?: Id<'documents'>;
  level?: number;
  data?: Doc<'documents'>[];
}
export const DocumentList = ({ parentDocumentId, level = 0 }: DocumentListProps) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const onExpand = (documentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
  };

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const documents = useQuery(api.documents.getSidebar, {
    parentDocument: parentDocumentId,
  });

  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }
  console.log('level is: ', level);
  return (
    <>
      <p
        className={cn(
          'hidden text-sm font-medium text-muted-foreground/80',
          expanded && 'last:block',
          level === 0 && 'hidden',
        )}
        style={{
          paddingLeft: level ? `${level * 12 + 25}px` : undefined,
        }}
      >
        No pages inside
      </p>
      {documents.map((document) => (
        <div key={document._id}>
          <Item
            active={params.documentId === document._id}
            documentIcon={document.icon}
            expanded={expanded[document._id]}
            icon={FileIcon}
            id={document._id}
            label={document.title}
            level={level}
            onExpand={() => onExpand(document._id)}
            onclick={() => {
              onRedirect(document._id);
            }}
          />
          {expanded[document._id] && <DocumentList level={level + 1} parentDocumentId={document._id} />}
        </div>
      ))}
    </>
  );
};

export default DocumentList;
